using System.ComponentModel.DataAnnotations;

namespace WebApplication1.Application.DTOs.Inputs.TeamAssignments;

public record UpdateTeamAssignmentInput(
    [Required] int Id,
    [StringLength(200, MinimumLength = 1)] string? Name,
    [StringLength(1000)] string? Description,
    [Required] int StatusId,
    int? UserId
);

