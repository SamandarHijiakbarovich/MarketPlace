namespace MarketPlace.Application.Products.Dtos;

public record ProductDetailDto(
    int Id,
    string Name,
    string Description,
    decimal Price,
    string ImageUrl,
    int Stock,
    int CategoryId,
    string CategoryName);
