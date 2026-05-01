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
        try
        {
            if (string.IsNullOrWhiteSpace(input.Username) || input.Username.Length < 3)
                return BadRequest("Имя пользователя должно содержать минимум 3 символа");

            if (string.IsNullOrWhiteSpace(input.Email) || !IsValidEmail(input.Email))
                return BadRequest("Некорректный email");

            if (string.IsNullOrWhiteSpace(input.Password) || input.Password.Length < 6)
                return BadRequest("Пароль должен содержать минимум 6 символов");

            await _authService.RegisterAsync(input);
            
            return Ok();
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost("login")]
    public async Task<ActionResult<UserResponse>> Login([FromBody] LoginInput input)
    {
        try
        {
            var response = await _authService.LoginAsync(input.Email, input.Password, HttpContext);
            
            return Ok(response);
        }
        catch (Exception ex)
        {
            return Unauthorized(ex.Message);
        }
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