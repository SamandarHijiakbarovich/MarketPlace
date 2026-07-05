using MarketPlace.Application.Delivery.Dtos;
using MarketPlace.Domain.Enums;

namespace MarketPlace.Application.Delivery;

public interface IDeliveryPricingService
{
    /// <summary>Checkout sahifasida ko'rsatiladigan yetkazib berish variantlari (narx + muddat).</summary>
    IReadOnlyList<DeliveryOptionDto> GetAvailableOptions();

    /// <summary>Tanlangan usul bo'yicha narx va taxminiy yetkazib berish sanasini hisoblaydi.</summary>
    (decimal Cost, DateTime EstimatedDate) Calculate(DeliveryMethod method);
}
