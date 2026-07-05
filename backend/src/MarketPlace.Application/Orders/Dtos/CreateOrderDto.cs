using MarketPlace.Application.Delivery.Dtos;
using MarketPlace.Domain.Enums;

namespace MarketPlace.Application.Orders.Dtos;

public record CreateOrderDto(
    Guid CartId,
    DeliveryAddressDto DeliveryAddress,
    DeliveryMethod DeliveryMethod,
    PaymentMethod PaymentMethod,
    string? CardNumber);
