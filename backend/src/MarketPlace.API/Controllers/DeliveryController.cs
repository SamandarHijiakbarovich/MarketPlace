using MarketPlace.Application.Delivery;
using Microsoft.AspNetCore.Mvc;

namespace MarketPlace.API.Controllers;

[ApiController]
[Route("api/delivery")]
public class DeliveryController : ControllerBase
{
    private readonly IDeliveryPricingService _deliveryPricingService;

    public DeliveryController(IDeliveryPricingService deliveryPricingService)
    {
        _deliveryPricingService = deliveryPricingService;
    }

    [HttpGet("options")]
    public IActionResult GetOptions()
    {
        var options = _deliveryPricingService.GetAvailableOptions();
        return Ok(options);
    }
}