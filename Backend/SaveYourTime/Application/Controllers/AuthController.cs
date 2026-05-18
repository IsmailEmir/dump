using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebApplication1.Application.DTOs.Inputs;
using WebApplication1.Application.DTOs.Inputs.Auth;
using WebApplication1.Application.DTOs.Responses;
using WebApplication1.Domain.Interfaces.Services;

namespace WebApplication1.Application.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService) => _authService = authService;

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] UserInput input)
    {
        if (string.IsNullOrWhiteSpace(input.Username) || input.Username.Length < 3)
            throw new ArgumentException("Имя пользователя должно содержать минимум 3 символа");

        if (string.IsNullOrWhiteSpace(input.Email) || !IsValidEmail(input.Email))
            throw new ArgumentException("Некорректный email");

        if (string.IsNullOrWhiteSpace(input.Password) || input.Password.Length < 6)
            throw new ArgumentException("Пароль должен содержать минимум 6 символов");

        await _authService.RegisterAsync(input);
        
        return Ok();
    }

    [HttpPost("login")]
    public async Task<ActionResult<UserResponse>> Login([FromBody] LoginInput input)
    {
        var response = await _authService.LoginAsync(input.Email, input.Password, HttpContext);
        
        return Ok(response);
    }

    [HttpPost("logout")]
    [Authorize]
    public async Task<IActionResult> Logout()
    {
        await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        return Ok(new { message = "Выход выполнен успешно" });
    }

    private bool IsValidEmail(string email) =>
        System.Text.RegularExpressions.Regex.IsMatch(email, @"^[^@\s]+@[^@\s]+\.[^@\s]+$");
}