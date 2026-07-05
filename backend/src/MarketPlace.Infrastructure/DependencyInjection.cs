using MarketPlace.Application.Admin;
using MarketPlace.Application.Auth;
using MarketPlace.Application.Cart;
using MarketPlace.Application.Categories;
using MarketPlace.Application.Delivery;
using MarketPlace.Application.Orders;
using MarketPlace.Application.Payments;
using MarketPlace.Application.Products;
using MarketPlace.Infrastructure.Persistence;
using MarketPlace.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace MarketPlace.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseSqlite(configuration.GetConnectionString("DefaultConnection")));

        services.Configure<JwtSettings>(configuration.GetSection("Jwt"));

        services.AddScoped<IProductService, ProductService>();
        services.AddScoped<ICategoryService, CategoryService>();
        services.AddScoped<ICartService, CartService>();
        services.AddScoped<IOrderService, OrderService>();
        services.AddScoped<IDeliveryPricingService, DeliveryPricingService>();
        services.AddScoped<IPaymentService, MockPaymentService>();
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IAdminDashboardService, AdminDashboardService>();

        return services;
    }
}
