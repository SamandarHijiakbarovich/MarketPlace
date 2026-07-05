namespace MarketPlace.Application.Cart.Dtos;

public record CartDto(
    Guid CartId,
    IReadOnlyList<CartItemDto> Items,
    decimal Total);
