namespace WebApplication1.Application.DTOs.Responses;

public record UserResponse(
    int Id,
    string UserName,
    string Email,
    DateTime CreatedAt,
    int CompletedTasksCount
);