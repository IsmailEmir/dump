using System.ComponentModel.DataAnnotations;

namespace WebApplication1.Application.DTOs.Inputs.Auth;

public record LoginInput(
    [Required]
    [EmailAddress]
    string Email,
    
    [Required]
    string Password
);
