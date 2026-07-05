namespace MarketPlace.Application.Products.Dtos;

public record UpdateProductDto(
    string Name,
    string Description,
    decimal Price,
    string ImageUrl,
    int Stock,
    int CategoryId);
