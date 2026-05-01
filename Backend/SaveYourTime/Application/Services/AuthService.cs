using System.Runtime.CompilerServices;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using WebApplication1.Domain.Interfaces.Services;
using WebApplication1.Application.DTOs.Inputs;
using WebApplication1.Application.DTOs.Responses;
using WebApplication1.Domain.Interfaces.Repositories;
using WebApplication1.Domain.Models;
using WebApplication1.Infrastructure.Utils;

namespace WebApplication1.Application.Services;


public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IRoleRepository _roleRepository;

    public AuthService(IUserRepository userRepository, IRoleRepository roleRepository)
    {
        _userRepository = userRepository;
        _roleRepository = roleRepository;
    }

    public async Task RegisterAsync(UserInput input)
    {
        if (await _userRepository.ExistsByEmailAsync(input.Email))
            throw new Exception("Email уже зарегистрирован");

        var roleId = await _roleRepository.GetDefaultRoleId();

        var user = new User
        {
            Username = input.Username,
            Email = input.Email,
            PasswordHash = PasswordHasher.Hash(input.Password),
            RoleId = roleId,
            CreatedAt = DateTime.UtcNow
        };

        await _userRepository.CreateAsync(user);
    }

    public async Task<UserResponse> LoginAsync(string email, string password, HttpContext httpContext)
    {
        var user = await _userRepository.GetByEmailAsync(email);

        if (user == null || !PasswordHasher.Verify(password, user.PasswordHash))
            throw new Exception("Неверный email или пароль");

        await _userRepository.UpdateLastLoginAsync(user.Id);
        
        await SetAuthCookie(user.Id, user.Username, user.Email, httpContext);
        return MapToResponse(user);
    }
    
    private async Task SetAuthCookie(int userId, string username, string email, HttpContext httpContext)
    {
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
            new Claim(ClaimTypes.Name, username),
            new Claim(ClaimTypes.Email, email)
        };

        var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
        var principal = new ClaimsPrincipal(identity);

        await httpContext.SignInAsync(
            CookieAuthenticationDefaults.AuthenticationScheme,
            principal,
            new AuthenticationProperties 
            { 
                ExpiresUtc = DateTime.UtcNow.AddDays(7), 
                IsPersistent = true 
            });
    }

    private UserResponse MapToResponse(User user) =>
        new UserResponse(
            user.Id,
            user.Username,
            user.Email ?? string.Empty,
            user.CreatedAt,
            user.Assignments?.Count(a => a.StatusId == 3) ?? 0
        );
}