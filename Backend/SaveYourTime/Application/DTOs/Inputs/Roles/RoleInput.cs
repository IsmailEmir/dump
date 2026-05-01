namespace WebApplication1.Application.DTOs.Inputs;

public record RoleInput(
    int Id,
    string Name,
    string? Description = null
);