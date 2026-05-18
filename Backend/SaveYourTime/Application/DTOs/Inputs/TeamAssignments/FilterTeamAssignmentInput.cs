namespace WebApplication1.Application.DTOs.Inputs.TeamAssignments;

public record FilterTeamAssignmentInput(
    int? TeamId = null,
    string? AssignmentName = null,
    string? UserName = null
);
