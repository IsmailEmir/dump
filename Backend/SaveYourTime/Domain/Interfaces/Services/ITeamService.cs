using WebApplication1.Application.DTOs.Inputs;
using WebApplication1.Application.DTOs.Responses;

namespace WebApplication1.Domain.Interfaces.Services;

public interface ITeamService
{
    Task<IEnumerable<TeamResponse>> GetAllAsync();
    Task<TeamResponse?> GetByIdAsync(int id);
    Task<IEnumerable<UserResponse>> GetUsersInTeamAsync(int teamId);

    Task CreateAsync(TeamInput input);
    Task UpdateAsync(TeamInput input);
    Task DeleteAsync(int id);
    Task AddUserToTeamAsync(int userId, int teamId);
    Task RemoveUserFromTeamAsync(int teamId, int userId);
    Task SetTeamLeaderAsync(int teamId, int userId);
}