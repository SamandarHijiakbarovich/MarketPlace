using MarketPlace.Application.Cart;
using MarketPlace.Application.Cart.Dtos;
using Microsoft.AspNetCore.Mvc;

namespace MarketPlace.API.Controllers;

[ApiController]
[Route("api/cart")]
public class CartController : ControllerBase
{
    private const string CartHeaderName = "X-Cart-Id";
    private readonly ICartService _cartService;

    public CartController(ICartService cartService)
    {
        _cartService = cartService;
    }

    [HttpGet]
    public async Task<IActionResult> Get(CancellationToken ct)
    {
        var cart = await _cartService.GetCartAsync(GetCartId(), ct);
        return Ok(cart);
    }

    [HttpPost("items")]
    public async Task<IActionResult> AddItem([FromBody] AddToCartDto dto, CancellationToken ct)
    {
        var cart = await _cartService.AddItemAsync(GetCartId(), dto, ct);
        return Ok(cart);
    }

    [HttpPut("items/{productId:int}")]
    public async Task<IActionResult> UpdateItem(int productId, [FromBody] UpdateCartItemDto dto, CancellationToken ct)
    {
        var cart = await _cartService.UpdateItemAsync(GetCartId(), productId, dto, ct);
        return Ok(cart);
    }

    [HttpDelete("items/{productId:int}")]
    public async Task<IActionResult> RemoveItem(int productId, CancellationToken ct)
    {
        var cart = await _cartService.RemoveItemAsync(GetCartId(), productId, ct);
        return Ok(cart);
    }

    private Guid GetCartId()
    {
        var header = Request.Headers[CartHeaderName].ToString();
        return Guid.TryParse(header, out var cartId) ? cartId : Guid.Empty;
    }
}