namespace WebApplication1.Application.DTOs.Inputs;

public record FilterTeamInput(
    string? Name = null,
    int? LeaderId = null
);
