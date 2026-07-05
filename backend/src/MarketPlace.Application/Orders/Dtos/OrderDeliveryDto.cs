using MarketPlace.Domain.Enums;

namespace MarketPlace.Application.Orders.Dtos;

// Buyurtma detali (admin) uchun yetkazib berish ma'lumoti.
public record OrderDeliveryDto(
    string FullName,
    string Phone,
    string Address,
    DeliveryMethod Method,
    decimal Cost,
    DateTime EstimatedDeliveryDate);
