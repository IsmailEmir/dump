namespace WebApplication1.Application.DTOs.Inputs.Assigments;

public record ChangeAssigmentInput(
    int AssigmentId,
    int UserId,
    string Title,
    string? Description,
    string Priority,
    DateTime? Deadline
    );