using MarketPlace.Domain.Enums;

namespace MarketPlace.Application.Orders.Dtos;

public record OrderSummaryDto(
    int Id,
    string OrderNumber,
    string CustomerName,
    string Phone,
    decimal Total,
    OrderStatus Status,
    DateTime CreatedAt);
