using WebApplication1.Application.DTOs.Inputs;
using WebApplication1.Application.DTOs.Responses;
using WebApplication1.Domain.Interfaces.Repositories;
using WebApplication1.Domain.Interfaces.Services;
using WebApplication1.Domain.Models;

namespace WebApplication1.Application.Services;

public class TeamService : ITeamService
{
    private readonly ITeamRepository _teamRepository;
    private readonly IUserRepository _userRepository;
    private readonly IAssignmentRepository _assignmentRepository;

    public TeamService(
        ITeamRepository teamRepository,
        IUserRepository userRepository,
        IAssignmentRepository assignmentRepository)
    {
        _teamRepository = teamRepository;
        _userRepository = userRepository;
        _assignmentRepository = assignmentRepository;
    }

    public async Task<IEnumerable<TeamResponse>> GetAllAsync()
    {
        var teams = await _teamRepository.GetAllAsync();
        return teams.Select(MapToResponse);
    }

    public async Task<TeamResponse?> GetByIdAsync(int id)
    {
        var team = await _teamRepository.GetByIdAsync(id);
        return team == null ? null : MapToResponse(team);
    }

    public async Task<IEnumerable<UserResponse>> GetUsersInTeamAsync(int teamId)
    {
        var users = await _teamRepository.GetUsersInTeamAsync(teamId);
        return users.Select(u => new UserResponse(
            u.Id,
            u.Username,
            u.Email ?? string.Empty,
            u.CreatedAt,
            u.Assignments?.Count(a => a.StatusId == 3) ?? 0
        ));
    }

    public async Task<IEnumerable<AssignmentResponse>> GetAssignmentsInTeamAsync(int teamId)
    {
        var assignments = await _teamRepository.GetAssignmentsInTeamAsync(teamId);
        return assignments.Select(MapAssignmentToResponse);
    }

    public async Task CreateAsync(TeamInput input)
    {
        var user = await _userRepository.GetByIdAsync(input.LeaderId);

        var team = new Team
        {
            Name = input.Name,
            Description = input.Description,
            LeaderId = user!.Id,
            CreatedAt = DateTime.UtcNow,
            
            Members = [user]
        };

        await _teamRepository.CreateAsync(team);
    }

    public async Task UpdateAsync(TeamInput input)
    {
        var team = await _teamRepository.GetByIdAsync(input.teamId);
        if (team == null)
            throw new Exception("Команда не найдена");

        team.Name = input.Name;
        team.Description = input.Description;

        await _teamRepository.UpdateAsync(team);
    }

    public async Task DeleteAsync(int id)
    {
        await _teamRepository.DeleteAsync(id);
    }

    public async Task AddUserToTeamAsync(string email, int teamId)
    {
        await _teamRepository.AddUserToTeamAsync(email, teamId);
    }

    public async Task RemoveUserFromTeamAsync(int teamId, int userId)
    {
        await _teamRepository.RemoveUserFromTeamAsync(teamId, userId);
    }

    public async Task SetTeamLeaderAsync(int teamId, int userId)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null)
            throw new Exception("Пользователь не найден");

        await _teamRepository.SetTeamLeaderAsync(teamId, userId);
    }

    private TeamResponse MapToResponse(Team team)
    {
        return new TeamResponse(
            team.Id,
            team.Name,
            team.Description,
            team.LeaderId,
            team.Leader?.Username,
            team.CreatedAt
        );
    }

    private AssignmentResponse MapAssignmentToResponse(Assignment a)
    {
        return new AssignmentResponse(
            a.Id,
            a.Title,
            a.Description,
            a.UserId,
            a.User.Username,
            a.Status.Name,
            a.Priority.Name,
            a.Deadline,
            a.CreatedAt
        );
    }
}