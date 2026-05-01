namespace WebApplication1.Domain.Interfaces.Services;

public interface ICurrentUserService
{
    int? GetCurrentUserId();
    string? GetCurrentUserName();
    bool IsAuthenticated();
}