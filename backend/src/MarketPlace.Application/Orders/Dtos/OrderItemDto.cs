namespace MarketPlace.Application.Orders.Dtos;

public record OrderItemDto(
    int ProductId,
    string ProductName,
    decimal UnitPrice,
    int Quantity,
    decimal Subtotal);
