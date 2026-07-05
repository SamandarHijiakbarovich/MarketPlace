using MarketPlace.Application.Cart;
using MarketPlace.Application.Cart.Dtos;
using MarketPlace.Application.Common.Exceptions;
using MarketPlace.Domain.Entities;
using MarketPlace.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace MarketPlace.Infrastructure.Services;

/// <summary>
/// Cart — buyer ro'yxatdan o'tmaydi, shuning uchun savat GUID orqali (frontend localStorage'da
/// saqlaydigan "cartId") aniqlanadi. Bu fayl to'liq tayyor — checkout bilan bog'liq eng
/// murakkab qism shu yerda (stock tekshiruvi, mahsulot bir necha marta qo'shilsa quantity qo'shiladi).
/// </summary>
public class CartService : ICartService
{
    private readonly ApplicationDbContext _db;

    public CartService(ApplicationDbContext db)
    {
        _db = db;
    }

    public async Task<CartDto> GetCartAsync(Guid cartId, CancellationToken ct = default)
    {
        var cart = await LoadCartAsync(cartId, ct);
        return cart is null ? EmptyCart(cartId) : ToDto(cart);
    }

    public async Task<CartDto> AddItemAsync(Guid cartId, AddToCartDto dto, CancellationToken ct = default)
    {
        if (dto.Quantity <= 0)
        {
            throw new BadRequestException("Miqdor (quantity) 0 dan katta bo'lishi kerak.");
        }

        var product = await _db.Products.FirstOrDefaultAsync(p => p.Id == dto.ProductId, ct);
        if (product is null)
        {
            throw new NotFoundException(nameof(Product), dto.ProductId);
        }

        var cart = await LoadCartAsync(cartId, ct);
        if (cart is null)
        {
            cart = new Cart();
            _db.Carts.Add(cart);
        }

        var existingItem = cart.Items.FirstOrDefault(i => i.ProductId == dto.ProductId);
        var newQuantity = (existingItem?.Quantity ?? 0) + dto.Quantity;

        if (newQuantity > product.Stock)
        {
            throw new BadRequestException($"Omborda faqat {product.Stock} dona '{product.Name}' bor.");
        }

        if (existingItem is null)
        {
            cart.Items.Add(new CartItem { ProductId = dto.ProductId, Quantity = dto.Quantity });
        }
        else
        {
            existingItem.Quantity = newQuantity;
        }

        await _db.SaveChangesAsync(ct);

        return await GetCartAsync(cart.Id, ct);
    }

    public async Task<CartDto> UpdateItemAsync(Guid cartId, int productId, UpdateCartItemDto dto, CancellationToken ct = default)
    {
        if (dto.Quantity <= 0)
        {
            throw new BadRequestException("Miqdor (quantity) 0 dan katta bo'lishi kerak.");
        }

        var cart = await LoadCartAsync(cartId, ct) ?? throw new NotFoundException(nameof(Cart), cartId);
        var item = cart.Items.FirstOrDefault(i => i.ProductId == productId)
            ?? throw new NotFoundException("CartItem", productId);

        if (dto.Quantity > item.Product.Stock)
        {
            throw new BadRequestException($"Omborda faqat {item.Product.Stock} dona '{item.Product.Name}' bor.");
        }

        item.Quantity = dto.Quantity;
        await _db.SaveChangesAsync(ct);

        return await GetCartAsync(cartId, ct);
    }

    public async Task<CartDto> RemoveItemAsync(Guid cartId, int productId, CancellationToken ct = default)
    {
        var cart = await LoadCartAsync(cartId, ct) ?? throw new NotFoundException(nameof(Cart), cartId);
        var item = cart.Items.FirstOrDefault(i => i.ProductId == productId);

        if (item is not null)
        {
            _db.CartItems.Remove(item);
            await _db.SaveChangesAsync(ct);
        }

        return await GetCartAsync(cartId, ct);
    }

    private async Task<Cart?> LoadCartAsync(Guid cartId, CancellationToken ct)
    {
        if (cartId == Guid.Empty) return null;

        return await _db.Carts
            .Include(c => c.Items)
            .ThenInclude(i => i.Product)
            .FirstOrDefaultAsync(c => c.Id == cartId, ct);
    }

    private static CartDto EmptyCart(Guid cartId) => new(cartId, Array.Empty<CartItemDto>(), 0m);

    private static CartDto ToDto(Cart cart)
    {
        var items = cart.Items
            .Select(i => new CartItemDto(i.ProductId, i.Product.Name, i.Product.ImageUrl, i.Product.Price, i.Quantity, i.Product.Price * i.Quantity))
            .ToList();

        return new CartDto(cart.Id, items, items.Sum(i => i.Subtotal));
    }
}
