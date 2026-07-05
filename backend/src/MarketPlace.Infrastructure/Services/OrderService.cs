using MarketPlace.Application.Common.Exceptions;
using MarketPlace.Application.Common.Models;
using MarketPlace.Application.Delivery;
using MarketPlace.Application.Orders;
using MarketPlace.Application.Orders.Dtos;
using MarketPlace.Application.Payments;
using MarketPlace.Domain.Entities;
using MarketPlace.Domain.Enums;
using MarketPlace.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace MarketPlace.Infrastructure.Services;

/// <summary>
/// Checkout — butun zanjirning eng muhim orkestratsiyasi: savatni tekshiradi, to'lovni
/// (IPaymentService) va yetkazib berish narxini (IDeliveryPricingService) hisoblaydi,
/// muvaffaqiyatli bo'lsagina Order/OrderItem/Delivery yozadi va stockni kamaytiradi.
/// To'lov muvaffaqiyatsiz bo'lsa — order UMUMAN saqlanmaydi, savat ham bo'shatilmaydi,
/// shunda foydalanuvchi qayta urinib ko'rishi mumkin.
/// </summary>
public class OrderService : IOrderService
{
    private readonly ApplicationDbContext _db;
    private readonly IDeliveryPricingService _deliveryPricing;
    private readonly IPaymentService _paymentService;

    public OrderService(ApplicationDbContext db, IDeliveryPricingService deliveryPricing, IPaymentService paymentService)
    {
        _db = db;
        _deliveryPricing = deliveryPricing;
        _paymentService = paymentService;
    }

    public async Task<OrderDto> CheckoutAsync(CreateOrderDto dto, CancellationToken ct = default)
    {
        var cart = await _db.Carts
            .Include(c => c.Items)
            .ThenInclude(i => i.Product)
            .FirstOrDefaultAsync(c => c.Id == dto.CartId, ct);

        if (cart is null || cart.Items.Count == 0)
        {
            throw new BadRequestException("Savat bo'sh — buyurtma berib bo'lmaydi.");
        }

        if (string.IsNullOrWhiteSpace(dto.DeliveryAddress.FullName) ||
            string.IsNullOrWhiteSpace(dto.DeliveryAddress.Phone) ||
            string.IsNullOrWhiteSpace(dto.DeliveryAddress.Address))
        {
            throw new BadRequestException("Ism, telefon va manzil to'ldirilishi shart.");
        }

        // Stockni qayta tekshiramiz — cart yaratilgandan beri boshqa xaridor sotib olgan bo'lishi mumkin.
        foreach (var item in cart.Items)
        {
            if (item.Quantity > item.Product.Stock)
            {
                throw new BadRequestException($"Omborda faqat {item.Product.Stock} dona '{item.Product.Name}' qoldi.");
            }
        }

        var subtotal = cart.Items.Sum(i => i.Product.Price * i.Quantity);
        var (deliveryCost, estimatedDate) = _deliveryPricing.Calculate(dto.DeliveryMethod);
        var total = subtotal + deliveryCost;

        var paymentResult = await _paymentService.ProcessAsync(dto.PaymentMethod, total, dto.CardNumber, ct);

        if (!paymentResult.Success)
        {
            throw new BadRequestException($"To'lov amalga oshmadi: {paymentResult.Message}");
        }

        var order = new Order
        {
            OrderNumber = GenerateOrderNumber(),
            Subtotal = subtotal,
            DeliveryCost = deliveryCost,
            Total = total,
            PaymentMethod = dto.PaymentMethod,
            PaymentStatus = PaymentStatus.Success,
            Status = OrderStatus.New,
            Items = cart.Items.Select(i => new OrderItem
            {
                ProductId = i.ProductId,
                ProductName = i.Product.Name,
                UnitPrice = i.Product.Price,
                Quantity = i.Quantity,
            }).ToList(),
            Delivery = new Delivery
            {
                FullName = dto.DeliveryAddress.FullName,
                Phone = dto.DeliveryAddress.Phone,
                Address = dto.DeliveryAddress.Address,
                Method = dto.DeliveryMethod,
                Cost = deliveryCost,
                EstimatedDeliveryDate = estimatedDate,
            },
        };

        foreach (var item in cart.Items)
        {
            item.Product.Stock -= item.Quantity;
        }

        _db.Orders.Add(order);
        _db.CartItems.RemoveRange(cart.Items);

        await _db.SaveChangesAsync(ct);

        return await GetByIdAsync(order.Id, ct);
    }

    public async Task<OrderDto> GetByIdAsync(int id, CancellationToken ct = default)
    {
        var order = await _db.Orders
            .Include(o => o.Items)
            .Include(o => o.Delivery)
            .FirstOrDefaultAsync(o => o.Id == id, ct);

        if (order is null)
        {
            throw new NotFoundException(nameof(Order), id);
        }

        return ToDto(order);
    }

    public async Task<PagedResult<OrderSummaryDto>> GetAllAsync(int page, int pageSize, CancellationToken ct = default)
    {
        page = page < 1 ? 1 : page;
        pageSize = pageSize < 1 ? 20 : pageSize;

        var query = _db.Orders.AsNoTracking().OrderByDescending(o => o.CreatedAt);
        var totalCount = await query.CountAsync(ct);

        var items = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(o => new OrderSummaryDto(o.Id, o.OrderNumber, o.Delivery.FullName, o.Delivery.Phone, o.Total, o.Status, o.CreatedAt))
            .ToListAsync(ct);

        return new PagedResult<OrderSummaryDto> { Items = items, TotalCount = totalCount, Page = page, PageSize = pageSize };
    }

    public async Task<OrderDto> UpdateStatusAsync(int id, UpdateOrderStatusDto dto, CancellationToken ct = default)
    {
        var order = await _db.Orders
            .Include(o => o.Items)
            .Include(o => o.Delivery)
            .FirstOrDefaultAsync(o => o.Id == id, ct);

        if (order is null)
        {
            throw new NotFoundException(nameof(Order), id);
        }

        order.Status = dto.Status;
        await _db.SaveChangesAsync(ct);

        return ToDto(order);
    }

    private static string GenerateOrderNumber() =>
        $"ORD-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString()[..6].ToUpper()}";

    private static OrderDto ToDto(Order o) => new(
        o.Id,
        o.OrderNumber,
        o.Items.Select(i => new OrderItemDto(i.ProductId, i.ProductName, i.UnitPrice, i.Quantity, i.Subtotal)).ToList(),
        o.Subtotal,
        o.DeliveryCost,
        o.Total,
        o.Status,
        o.PaymentMethod,
        o.PaymentStatus,
        o.CreatedAt,
        new OrderDeliveryDto(
            o.Delivery.FullName,
            o.Delivery.Phone,
            o.Delivery.Address,
            o.Delivery.Method,
            o.Delivery.Cost,
            o.Delivery.EstimatedDeliveryDate));
}
