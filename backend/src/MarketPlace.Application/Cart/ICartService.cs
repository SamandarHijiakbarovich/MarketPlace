using MarketPlace.Application.Cart.Dtos;

namespace MarketPlace.Application.Cart;

public interface ICartService
{
    /// <summary>Cart topilmasa, bo'sh CartDto (Items=[]) qaytariladi — yangi cart yaratilmaydi.</summary>
    Task<CartDto> GetCartAsync(Guid cartId, CancellationToken ct = default);

    /// <summary>cartId bo'sh (Guid.Empty) bo'lsa, yangi cart yaratiladi va natijada yangi CartId qaytadi.</summary>
    Task<CartDto> AddItemAsync(Guid cartId, AddToCartDto dto, CancellationToken ct = default);

    Task<CartDto> UpdateItemAsync(Guid cartId, int productId, UpdateCartItemDto dto, CancellationToken ct = default);
    Task<CartDto> RemoveItemAsync(Guid cartId, int productId, CancellationToken ct = default);
}
