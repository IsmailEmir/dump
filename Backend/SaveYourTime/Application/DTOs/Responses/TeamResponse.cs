namespace WebApplication1.Application.DTOs.Responses;

public record TeamResponse(
    int Id,
    string Name,
    string? Description,
    string? AvatarUrl,
    int? LeaderId,
    string? LeaderName,
    DateTime CreatedAt,
    List<UserResponse>? Members = null
);