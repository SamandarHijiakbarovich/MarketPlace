using MarketPlace.Domain.Enums;

namespace MarketPlace.Domain.Entities;

public class Delivery
{
    public int Id { get; set; }

    public int OrderId { get; set; }
    public Order Order { get; set; } = null!;

    public string FullName { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;

    public DeliveryMethod Method { get; set; }
    public decimal Cost { get; set; }
    public DateTime EstimatedDeliveryDate { get; set; }
}
