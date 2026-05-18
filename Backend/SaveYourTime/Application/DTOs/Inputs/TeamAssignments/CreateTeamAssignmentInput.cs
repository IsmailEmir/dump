using System.ComponentModel.DataAnnotations;

namespace WebApplication1.Application.DTOs.Inputs.TeamAssignments;

public record CreateTeamAssignmentInput(
    [Required] int TeamId,
    [Required] [StringLength(200, MinimumLength = 1)] string Name,
    [StringLength(1000)] string? Description,
    int? UserId,
    string? Priority,
    DateTime? Deadline
);

