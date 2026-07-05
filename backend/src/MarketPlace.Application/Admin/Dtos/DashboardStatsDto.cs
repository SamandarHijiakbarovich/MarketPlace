namespace MarketPlace.Application.Admin.Dtos;

public record DashboardStatsDto(int TotalOrders, decimal TotalRevenue, int NewOrders, int ProductsCount);
