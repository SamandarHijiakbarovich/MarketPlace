namespace MarketPlace.Application.Products.Dtos;

public record ProductListItemDto(
    int Id,
    string Name,
    decimal Price,
    string ImageUrl,
    string CategoryName,
    int Stock);
