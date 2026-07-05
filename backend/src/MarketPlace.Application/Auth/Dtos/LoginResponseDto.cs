namespace MarketPlace.Application.Auth.Dtos;

public record LoginResponseDto(string Token, string Email, DateTime ExpiresAt);
