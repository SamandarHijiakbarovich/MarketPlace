using MarketPlace.Application.Categories;
using MarketPlace.Application.Categories.Dtos;
using MarketPlace.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace MarketPlace.Infrastructure.Services;

public class CategoryService : ICategoryService
{
    private readonly ApplicationDbContext _db;

    public CategoryService(ApplicationDbContext db)
    {
        _db = db;
    }

    public async Task<IReadOnlyList<CategoryDto>> GetAllAsync(CancellationToken ct = default)
    {
        return await _db.Categories
            .AsNoTracking()
            .OrderBy(c => c.Name)
            .Select(c => new CategoryDto(c.Id, c.Name, c.Slug))
            .ToListAsync(ct);
    }
}