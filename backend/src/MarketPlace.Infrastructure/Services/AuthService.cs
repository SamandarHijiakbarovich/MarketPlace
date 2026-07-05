using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using MarketPlace.Application.Auth;
using MarketPlace.Application.Auth.Dtos;
using MarketPlace.Application.Common.Exceptions;
using MarketPlace.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace MarketPlace.Infrastructure.Services;

/// <summary>
/// Admin login: parolni tekshiradi (BCrypt) va JWT token yaratadi.
/// Bu fayl to'liq tayyor — JWT sozlash ko'p loyihalarda takrorlanadigan "infra" qismi,
/// business-logikaga aloqasi yo'q, shuning uchun buni men yozib qo'ydim.
/// </summary>
public class AuthService : IAuthService
{
    private readonly ApplicationDbContext _db;
    private readonly JwtSettings _jwtSettings;

    public AuthService(ApplicationDbContext db, IOptions<JwtSettings> jwtOptions)
    {
        _db = db;
        _jwtSettings = jwtOptions.Value;
    }

    public async Task<LoginResponseDto> LoginAsync(LoginRequestDto dto, CancellationToken ct = default)
    {
        var user = await _db.AdminUsers.SingleOrDefaultAsync(u => u.Email == dto.Email, ct);

        if (user is null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
        {
            throw new UnauthorizedAppException("Email yoki parol noto'g'ri.");
        }

        var expiresAt = DateTime.UtcNow.AddMinutes(_jwtSettings.ExpiryMinutes);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role),
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.Secret));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _jwtSettings.Issuer,
            audience: _jwtSettings.Audience,
            claims: claims,
            expires: expiresAt,
            signingCredentials: credentials);

        var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

        return new LoginResponseDto(tokenString, user.Email, expiresAt);
    }
}
