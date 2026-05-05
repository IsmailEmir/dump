using WebApplication1.Domain.Models;

namespace WebApplication1.Domain.Interfaces.Repositories;

public interface ITeamAssignmentRepository
{
    Task<IEnumerable<TeamAssignment>> GetByTeamIdAsync(int teamId);
    Task<TeamAssignment?> GetByIdAsync(int id);
    Task CreateAsync(TeamAssignment assignment);
    Task UpdateAsync(TeamAssignment assignment);
    Task DeleteAsync(int id);
}

