using System.ComponentModel.DataAnnotations;

namespace WebApplication1.Application.DTOs.Inputs.Auth;

public record RegisterInput(
    [Required]
    [StringLength(50, MinimumLength = 3)]
    string Username,
    
    [Required]
    [EmailAddress]
    string Email,
    
    [Required]
    [StringLength(100, MinimumLength = 6)]
    string Password
);
