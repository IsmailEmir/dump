namespace WebApplication1.Application.DTOs.Inputs;

public record UserInput(
    int UserId,
    string Username,
    string Email,
    string Password,
    int RoleId
);