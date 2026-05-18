namespace WebApplication1.Application.DTOs.Inputs;

public record FilterUserInput(
    string? Username = null,
    int? RoleId = null
);
