using System.Security.Claims;
using WebApplication1.Domain.Interfaces.Services;

namespace WebApplication1.Application.Services;

public class CurrentUserService : ICurrentUserService
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CurrentUserService(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public int? GetCurrentUserId()
    {
        var id = _httpContextAccessor.HttpContext?.User
            .FindFirst(ClaimTypes.NameIdentifier)?.Value;
        
        return int.TryParse(id, out var userId) ? userId : null;
    }

    public string? GetCurrentUserName() =>
        _httpContextAccessor.HttpContext?.User
            .FindFirst(ClaimTypes.Name)?.Value;

    public bool IsAuthenticated() =>
        _httpContextAccessor.HttpContext?.User.Identity?.IsAuthenticated == true;
}