using WebApplication1.Application.DTOs.Inputs.TeamAssignments;
using WebApplication1.Application.DTOs.Responses;

namespace WebApplication1.Domain.Interfaces.Services;

public interface ITeamAssignmentService
{
    Task<IEnumerable<TeamAssignmentResponse>> GetByTeamIdAsync(int teamId);
    Task<TeamAssignmentResponse?> GetByIdAsync(int id);
    Task<int> CreateAsync(CreateTeamAssignmentInput input);
    Task UpdateAsync(UpdateTeamAssignmentInput input);
    Task DeleteAsync(int id);
}

