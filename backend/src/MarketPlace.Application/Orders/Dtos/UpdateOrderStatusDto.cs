using MarketPlace.Domain.Enums;

namespace MarketPlace.Application.Orders.Dtos;

public record UpdateOrderStatusDto(OrderStatus Status);
