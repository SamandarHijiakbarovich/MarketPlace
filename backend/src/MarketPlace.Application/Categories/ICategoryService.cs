using MarketPlace.Application.Categories.Dtos;

namespace MarketPlace.Application.Categories;

public interface ICategoryService
{
    Task<IReadOnlyList<CategoryDto>> GetAllAsync(CancellationToken ct = default);
}
