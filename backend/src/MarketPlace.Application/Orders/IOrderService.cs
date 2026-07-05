using MarketPlace.Application.Common.Models;
using MarketPlace.Application.Orders.Dtos;

namespace MarketPlace.Application.Orders;

public interface IOrderService
{
    /// <summary>
    /// Checkout: cart'ni tekshiradi (stock, bo'sh emasligi), to'lovni (IPaymentService) va yetkazib
    /// berish narxini (IDeliveryPricingService) hisoblaydi, Order + Delivery yozuvlarini yaratadi,
    /// muvaffaqiyatli to'lovdan so'ng cart'ni tozalaydi.
    /// </summary>
    Task<OrderDto> CheckoutAsync(CreateOrderDto dto, CancellationToken ct = default);

    Task<OrderDto> GetByIdAsync(int id, CancellationToken ct = default);
    Task<PagedResult<OrderSummaryDto>> GetAllAsync(int page, int pageSize, CancellationToken ct = default);
    Task<OrderDto> UpdateStatusAsync(int id, UpdateOrderStatusDto dto, CancellationToken ct = default);
}
