using MarketPlace.Domain.Entities;

namespace MarketPlace.Infrastructure.Persistence.Seed;

public static class DbSeeder
{
    public static async Task SeedAsync(ApplicationDbContext db)
    {
        if (!db.Categories.Any())
        {
            var categories = new List<Category>
            {
                new() { Name = "Smartfonlar", Slug = "smartfonlar" },
                new() { Name = "Noutbuklar", Slug = "noutbuklar" },
                new() { Name = "Quloqchinlar", Slug = "quloqchinlar" },
                new() { Name = "Aksessuarlar", Slug = "aksessuarlar" },
            };
            db.Categories.AddRange(categories);
            await db.SaveChangesAsync();

            db.Products.AddRange(
                new Product { Name = "iPhone 15 Pro", Description = "6.1\" Super Retina XDR, A17 Pro chip, 128GB", Price = 999m, Stock = 15, ImageUrl = "https://placehold.co/400x400?text=iPhone+15+Pro", CategoryId = categories[0].Id },
                new Product { Name = "Samsung Galaxy S24", Description = "6.2\" Dynamic AMOLED, Snapdragon 8 Gen 3, 256GB", Price = 849m, Stock = 20, ImageUrl = "https://placehold.co/400x400?text=Galaxy+S24", CategoryId = categories[0].Id },
                new Product { Name = "Xiaomi 14", Description = "6.36\" AMOLED, Snapdragon 8 Gen 3, 256GB", Price = 699m, Stock = 18, ImageUrl = "https://placehold.co/400x400?text=Xiaomi+14", CategoryId = categories[0].Id },
                new Product { Name = "MacBook Air M2", Description = "13.6\" Liquid Retina, Apple M2, 8GB/256GB", Price = 1199m, Stock = 10, ImageUrl = "https://placehold.co/400x400?text=MacBook+Air", CategoryId = categories[1].Id },
                new Product { Name = "Dell XPS 13", Description = "13.4\" FHD+, Intel Core i7, 16GB/512GB", Price = 1099m, Stock = 8, ImageUrl = "https://placehold.co/400x400?text=Dell+XPS+13", CategoryId = categories[1].Id },
                new Product { Name = "Lenovo ThinkPad E14", Description = "14\" FHD, Intel Core i5, 8GB/512GB", Price = 749m, Stock = 12, ImageUrl = "https://placehold.co/400x400?text=ThinkPad+E14", CategoryId = categories[1].Id },
                new Product { Name = "AirPods Pro 2", Description = "Active Noise Cancellation, USB-C", Price = 249m, Stock = 30, ImageUrl = "https://placehold.co/400x400?text=AirPods+Pro", CategoryId = categories[2].Id },
                new Product { Name = "Sony WH-1000XM5", Description = "Wireless Noise Cancelling Headphones", Price = 349m, Stock = 12, ImageUrl = "https://placehold.co/400x400?text=Sony+WH-1000XM5", CategoryId = categories[2].Id },
                new Product { Name = "Anker 20W Charger", Description = "USB-C Fast Charger, PowerIQ 3.0", Price = 19m, Stock = 50, ImageUrl = "https://placehold.co/400x400?text=Anker+Charger", CategoryId = categories[3].Id },
                new Product { Name = "Logitech MX Master 3S", Description = "Wireless Performance Mouse", Price = 99m, Stock = 25, ImageUrl = "https://placehold.co/400x400?text=MX+Master+3S", CategoryId = categories[3].Id }
            );
            await db.SaveChangesAsync();
        }

        if (!db.AdminUsers.Any())
        {
            db.AdminUsers.Add(new AdminUser
            {
                Email = "admin@marketplace.uz",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123!"),
                Role = "Admin"
            });
            await db.SaveChangesAsync();
        }
    }
}
