using MarketPlace.Application.Common.Exceptions;
using MarketPlace.Application.Common.Models;
using MarketPlace.Application.Products;
using MarketPlace.Application.Products.Dtos;
using MarketPlace.Domain.Entities;
using MarketPlace.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace MarketPlace.Infrastructure.Services;

/// <summary>
/// BU FAYL — "NAMUNA" (reference pattern). Qolgan servislarni (CategoryService,
/// DeliveryPricingService, MockPaymentService, AdminDashboardService) yozganda
/// aynan shu strukturaga qarang:
///   1. IQueryable bilan boshlang (hali bazaga so'rov ketmaydi)
///   2. Filtrlarni shart bo'lsagina qo'shing (Where)
///   3. Saralash / sahifalash
///   4. .Select(...) bilan to'g'ridan-to'g'ri DTO'ga proyeksiya qiling (Entity qaytarmang!)
///   5. Topilmasa — NotFoundException tashlang, controller buni avtomatik 404'ga aylantiradi.
/// </summary>
public class ProductService : IProductService
{
    private readonly ApplicationDbContext _db;

    public ProductService(ApplicationDbContext db)
    {
        _db = db;
    }

    public async Task<PagedResult<ProductListItemDto>> GetProductsAsync(ProductQueryParameters query, CancellationToken ct = default)
    {
        var products = _db.Products.AsNoTracking().Include(p => p.Category).AsQueryable();

        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            var search = query.Search.Trim().ToLower();
            products = products.Where(p => p.Name.ToLower().Contains(search));
        }

        if (query.CategoryId.HasValue)
        {
            products = products.Where(p => p.CategoryId == query.CategoryId.Value);
        }

        products = query.SortBy?.ToLower() switch
        {
            "price" => query.Descending ? products.OrderByDescending(p => p.Price) : products.OrderBy(p => p.Price),
            "name" => query.Descending ? products.OrderByDescending(p => p.Name) : products.OrderBy(p => p.Name),
            _ => products.OrderByDescending(p => p.CreatedAt),
        };

        var totalCount = await products.CountAsync(ct);

        var page = query.Page < 1 ? 1 : query.Page;
        var pageSize = query.PageSize < 1 ? 12 : query.PageSize;

        var items = await products
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(p => new ProductListItemDto(p.Id, p.Name, p.Price, p.ImageUrl, p.Category.Name, p.Stock))
            .ToListAsync(ct);

        return new PagedResult<ProductListItemDto>
        {
            Items = items,
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize,
        };
    }

    public async Task<ProductDetailDto> GetByIdAsync(int id, CancellationToken ct = default)
    {
        var product = await _db.Products.AsNoTracking()
            .Include(p => p.Category)
            .FirstOrDefaultAsync(p => p.Id == id, ct);

        if (product is null)
        {
            throw new NotFoundException(nameof(Product), id);
        }

        return ToDetailDto(product);
    }

    public async Task<ProductDetailDto> CreateAsync(CreateProductDto dto, CancellationToken ct = default)
    {
        var categoryExists = await _db.Categories.AnyAsync(c => c.Id == dto.CategoryId, ct);
        if (!categoryExists)
        {
            throw new BadRequestException($"CategoryId={dto.CategoryId} topilmadi.");
        }

        var product = new Product
        {
            Name = dto.Name,
            Description = dto.Description,
            Price = dto.Price,
            ImageUrl = dto.ImageUrl,
            Stock = dto.Stock,
            CategoryId = dto.CategoryId,
        };

        _db.Products.Add(product);
        await _db.SaveChangesAsync(ct);

        return await GetByIdAsync(product.Id, ct);
    }

    public async Task<ProductDetailDto> UpdateAsync(int id, UpdateProductDto dto, CancellationToken ct = default)
    {
        var product = await _db.Products.FirstOrDefaultAsync(p => p.Id == id, ct);
        if (product is null)
        {
            throw new NotFoundException(nameof(Product), id);
        }

        var categoryExists = await _db.Categories.AnyAsync(c => c.Id == dto.CategoryId, ct);
        if (!categoryExists)
        {
            throw new BadRequestException($"CategoryId={dto.CategoryId} topilmadi.");
        }

        product.Name = dto.Name;
        product.Description = dto.Description;
        product.Price = dto.Price;
        product.ImageUrl = dto.ImageUrl;
        product.Stock = dto.Stock;
        product.CategoryId = dto.CategoryId;
        product.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync(ct);

        return await GetByIdAsync(product.Id, ct);
    }

    public async Task DeleteAsync(int id, CancellationToken ct = default)
    {
        var product = await _db.Products.FirstOrDefaultAsync(p => p.Id == id, ct);
        if (product is null)
        {
            throw new NotFoundException(nameof(Product), id);
        }

        _db.Products.Remove(product);
        await _db.SaveChangesAsync(ct);
    }

    private static ProductDetailDto ToDetailDto(Product p) => new(
        p.Id, p.Name, p.Description, p.Price, p.ImageUrl, p.Stock, p.CategoryId, p.Category.Name);
}
