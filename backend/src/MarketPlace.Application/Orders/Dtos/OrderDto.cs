using MarketPlace.Domain.Enums;

namespace MarketPlace.Application.Orders.Dtos;

public record OrderDto(
    int Id,
    string OrderNumber,
    IReadOnlyList<OrderItemDto> Items,
    decimal Subtotal,
    decimal DeliveryCost,
    decimal Total,
    OrderStatus Status,
    PaymentMethod PaymentMethod,
    PaymentStatus PaymentStatus,
    DateTime CreatedAt,
    OrderDeliveryDto Delivery);
