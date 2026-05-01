namespace WebApplication1.Application.DTOs.Responses;

public record AuthResponse(int UserId, string Username, string Email, DateTime ExpiresAt);