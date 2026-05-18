using WebApplication1.Application.DTOs.Inputs;
using WebApplication1.Application.DTOs.Responses;

namespace WebApplication1.Domain.Interfaces.Services;


public interface IAuthService
{
    Task RegisterAsync(UserInput input);
    Task<UserResponse> LoginAsync(string email, string password, HttpContext httpContext);
}