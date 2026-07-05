using MarketPlace.Application.Auth.Dtos;

namespace MarketPlace.Application.Auth;

public interface IAuthService
{
    Task<LoginResponseDto> LoginAsync(LoginRequestDto dto, CancellationToken ct = default);
}
