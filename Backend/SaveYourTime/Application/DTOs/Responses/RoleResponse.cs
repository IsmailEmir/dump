namespace WebApplication1.Application.DTOs.Responses;

public record RoleResponse(
    int Id,
    string Name,
    string? Description
);