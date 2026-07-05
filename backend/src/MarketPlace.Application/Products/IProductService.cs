using MarketPlace.Application.Common.Models;
using MarketPlace.Application.Products.Dtos;

namespace MarketPlace.Application.Products;

public interface IProductService
{
    Task<PagedResult<ProductListItemDto>> GetProductsAsync(ProductQueryParameters query, CancellationToken ct = default);
    Task<ProductDetailDto> GetByIdAsync(int id, CancellationToken ct = default);
    Task<ProductDetailDto> CreateAsync(CreateProductDto dto, CancellationToken ct = default);
    Task<ProductDetailDto> UpdateAsync(int id, UpdateProductDto dto, CancellationToken ct = default);
    Task DeleteAsync(int id, CancellationToken ct = default);
}
