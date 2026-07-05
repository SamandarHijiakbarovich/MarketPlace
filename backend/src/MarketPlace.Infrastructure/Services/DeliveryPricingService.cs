using MarketPlace.Application.Delivery;
using MarketPlace.Application.Delivery.Dtos;
using MarketPlace.Domain.Enums;

namespace MarketPlace.Infrastructure.Services;

public class DeliveryPricingService : IDeliveryPricingService
{
    private const decimal StandardCost = 25000m;
    private const decimal ExpressCost = 50000m;
    private const int StandardEtaDays = 3;
    private const int ExpressEtaDays = 1;

    public IReadOnlyList<DeliveryOptionDto> GetAvailableOptions()
    {
        return new List<DeliveryOptionDto>
        {
            new(nameof(DeliveryMethod.Standard), StandardCost, StandardEtaDays),
            new(nameof(DeliveryMethod.Express), ExpressCost, ExpressEtaDays),
        };
    }

    public (decimal Cost, DateTime EstimatedDate) Calculate(DeliveryMethod method)
    {
        return method switch
        {
            DeliveryMethod.Express => (ExpressCost, DateTime.UtcNow.AddDays(ExpressEtaDays)),
            _ => (StandardCost, DateTime.UtcNow.AddDays(StandardEtaDays)),
        };
    }
}