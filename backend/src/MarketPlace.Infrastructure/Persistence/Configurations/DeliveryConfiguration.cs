using MarketPlace.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MarketPlace.Infrastructure.Persistence.Configurations;

public class DeliveryConfiguration : IEntityTypeConfiguration<Delivery>
{
    public void Configure(EntityTypeBuilder<Delivery> builder)
    {
        builder.Property(d => d.FullName).IsRequired().HasMaxLength(200);
        builder.Property(d => d.Phone).IsRequired().HasMaxLength(30);
        builder.Property(d => d.Address).IsRequired().HasMaxLength(500);
        builder.Property(d => d.Cost).HasConversion<double>();
    }
}
