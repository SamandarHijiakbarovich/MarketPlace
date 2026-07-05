using MarketPlace.Application.Products;
using MarketPlace.Application.Products.Dtos;
using Microsoft.AspNetCore.Mvc;

namespace MarketPlace.API.Controllers;

/// <summary>
/// NAMUNA (reference) controller — xaridor uchun ochiq (auth talab qilinmaydi).
/// Qolgan public controller'larni (Categories, Cart, Orders, Delivery, Auth) shu naqshga
/// qarab yozing: konstruktorda interfeys inject qilinadi, metod ichida faqat servisni
/// chaqirib Ok()/NotFound() bilan qaytarasiz — biznes-mantiq bu yerda emas, servisda.
/// </summary>
[ApiController]
[Route("api/products")]
public class ProductsController : ControllerBase
{
    private readonly IProductService _productService;

    public ProductsController(IProductService productService)
    {
        _productService = productService;
    }

    /// <summary>GET /api/products?search=&categoryId=&sortBy=price&descending=false&page=1&pageSize=12</summary>
    [HttpGet]
    public async Task<IActionResult> GetProducts([FromQuery] ProductQueryParameters query, CancellationToken ct)
    {
        var result = await _productService.GetProductsAsync(query, ct);
        return Ok(result);
    }

    /// <summary>GET /api/products/5</summary>
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id, CancellationToken ct)
    {
        var product = await _productService.GetByIdAsync(id, ct);
        return Ok(product);
    }
}
