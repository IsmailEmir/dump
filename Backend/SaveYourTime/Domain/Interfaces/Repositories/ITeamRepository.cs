using WebApplication1.Domain.Models;

namespace WebApplication1.Domain.Interfaces.Repositories;

public interface ITeamRepository
{
    Task<IEnumerable<Team>> GetAllAsync();
    Task<Team?> GetByIdAsync(int id);
    Task<IEnumerable<User>> GetUsersInTeamAsync(int teamId);
    Task<IEnumerable<Assignment>> GetAssignmentsInTeamAsync(int teamId);
    Task<Team> CreateAsync(Team team);
    Task DeleteAsync(int id);
    Task UpdateAsync(Team team);
    Task AddUserToTeamAsync(int userId, int teamId);
    Task RemoveUserFromTeamAsync(int teamId, int userId);
    Task SetTeamLeaderAsync(int teamId, int userId);
}