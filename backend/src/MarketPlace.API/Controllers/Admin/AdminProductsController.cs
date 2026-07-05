using MarketPlace.Application.Products;
using MarketPlace.Application.Products.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MarketPlace.API.Controllers.Admin;

/// <summary>
/// NAMUNA (reference) — [Authorize] bilan himoyalangan admin CRUD controller.
/// AdminOrdersController va AdminDashboardController'ni shu naqshga qarab yozing.
/// JWT token bo'lmasa yoki noto'g'ri bo'lsa, ASP.NET Core avtomatik 401 qaytaradi.
/// </summary>
[ApiController]
[Route("api/admin/products")]
[Authorize]
public class AdminProductsController : ControllerBase
{
    private readonly IProductService _productService;

    public AdminProductsController(IProductService productService)
    {
        _productService = productService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] ProductQueryParameters query, CancellationToken ct)
    {
        var result = await _productService.GetProductsAsync(query, ct);
        return Ok(result);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id, CancellationToken ct)
    {
        var product = await _productService.GetByIdAsync(id, ct);
        return Ok(product);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateProductDto dto, CancellationToken ct)
    {
        var product = await _productService.CreateAsync(dto, ct);
        return CreatedAtAction(nameof(GetById), new { id = product.Id }, product);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateProductDto dto, CancellationToken ct)
    {
        var product = await _productService.UpdateAsync(id, dto, ct);
        return Ok(product);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id, CancellationToken ct)
    {
        await _productService.DeleteAsync(id, ct);
        return NoContent();
    }
}
