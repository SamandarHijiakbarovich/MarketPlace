namespace MarketPlace.Application.Cart.Dtos;

public record CartItemDto(
    int ProductId,
    string ProductName,
    string ImageUrl,
    decimal UnitPrice,
    int Quantity,
    decimal Subtotal);
