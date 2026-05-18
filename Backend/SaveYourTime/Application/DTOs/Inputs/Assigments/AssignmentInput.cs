using System.ComponentModel.DataAnnotations;

namespace WebApplication1.Application.DTOs.Inputs.Assigments;

public record AssignmentInput(
        [Required]
        [StringLength(200, MinimumLength = 1)]
        string Title,

        [StringLength(1000)] string? Description,

        [Required] [StringLength(20)] string Priority,
 

    DateTime? Deadline
);
