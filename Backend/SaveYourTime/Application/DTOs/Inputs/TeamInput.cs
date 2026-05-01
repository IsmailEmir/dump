namespace WebApplication1.Application.DTOs.Inputs;

public record TeamInput(
    int LeaderId, // Это id пользователя, т.к он создает задачу
    int teamId,
    string Name,
    string? Description = null
);