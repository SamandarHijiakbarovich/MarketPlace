using MarketPlace.Application.Admin.Dtos;

namespace MarketPlace.Application.Admin;

public interface IAdminDashboardService
{
    Task<DashboardStatsDto> GetStatsAsync(CancellationToken ct = default);
}
