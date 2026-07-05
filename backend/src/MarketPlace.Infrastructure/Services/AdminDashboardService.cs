using MarketPlace.Application.Admin;
using MarketPlace.Application.Admin.Dtos;
using MarketPlace.Domain.Enums;
using MarketPlace.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace MarketPlace.Infrastructure.Services;

public class AdminDashboardService : IAdminDashboardService
{
    private readonly ApplicationDbContext _db;

    public AdminDashboardService(ApplicationDbContext db)
    {
        _db = db;
    }

    public async Task<DashboardStatsDto> GetStatsAsync(CancellationToken ct = default)
    {
        var totalOrders = await _db.Orders.CountAsync(ct);
        var newOrders = await _db.Orders.CountAsync(o => o.Status == OrderStatus.New, ct);
        var totalRevenue = await _db.Orders
            .Where(o => o.PaymentStatus == PaymentStatus.Success)
            .SumAsync(o => o.Total, ct);
        var productsCount = await _db.Products.CountAsync(ct);

        return new DashboardStatsDto(totalOrders, totalRevenue, newOrders, productsCount);
    }
}