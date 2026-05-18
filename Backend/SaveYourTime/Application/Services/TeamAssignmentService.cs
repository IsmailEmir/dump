using WebApplication1.Application.DTOs.Inputs.TeamAssignments;
using WebApplication1.Application.DTOs.Responses;
using WebApplication1.Domain.Interfaces.Repositories;
using WebApplication1.Domain.Interfaces.Services;
using WebApplication1.Domain.Models;

namespace WebApplication1.Application.Services;

public class TeamAssignmentService : ITeamAssignmentService
{
    private readonly ITeamAssignmentRepository _teamAssignmentRepository;
    private readonly ITeamRepository _teamRepository;
    private readonly IUserRepository _userRepository;

    public TeamAssignmentService(
        ITeamAssignmentRepository teamAssignmentRepository,
        ITeamRepository teamRepository,
        IUserRepository userRepository)
    {
        _teamAssignmentRepository = teamAssignmentRepository;
        _teamRepository = teamRepository;
        _userRepository = userRepository;
    }

    public async Task<IEnumerable<TeamAssignmentResponse>> GetByTeamIdAsync(int teamId)
    {
        var assignments = await _teamAssignmentRepository.GetByTeamIdAsync(teamId);
        return assignments.Select(MapToResponse);
    }

    public async Task<TeamAssignmentResponse?> GetByIdAsync(int id)
    {
        var assignment = await _teamAssignmentRepository.GetByIdAsync(id);
        return assignment == null ? null : MapToResponse(assignment);
    }

    public async Task<int> CreateAsync(CreateTeamAssignmentInput input)
    {
        var team = await _teamRepository.GetByIdAsync(input.TeamId);
        if (team == null)
            throw new Exception("Команда не найдена");

        if (input.UserId.HasValue)
        {
            var user = await _userRepository.GetByIdAsync(input.UserId.Value);
            if (user == null)
                throw new Exception("Пользователь не найден");
        }

        int priorityId = input.Priority switch
        {
            "low" => 1,
            "medium" => 2,
            "high" => 3,
            _ => 2
        };

        var assignment = new TeamAssignment
        {
            TeamId = input.TeamId,
            Name = input.Name,
            Description = input.Description,
            StatusId = 1,
            UserId = input.UserId,
            Priority = input.Priority,
            Deadline = input.Deadline,
            CreatedAt = DateTime.UtcNow
        };

        await _teamAssignmentRepository.CreateAsync(assignment);
        return assignment.Id;
    }

    public async Task UpdateAsync(UpdateTeamAssignmentInput input)
    {
        var assignment = await _teamAssignmentRepository.GetByIdAsync(input.Id);
        if (assignment == null)
            throw new Exception("Задача не найдена");

        if (input.UserId.HasValue)
        {
            var user = await _userRepository.GetByIdAsync(input.UserId.Value);
            if (user == null)
                throw new Exception("Пользователь не найден");
        }

        if (!string.IsNullOrEmpty(input.Name))
            assignment.Name = input.Name;

        if (input.Description != null)
            assignment.Description = input.Description;

        assignment.StatusId = input.StatusId;
        assignment.UserId = input.UserId;

        if (input.Priority != null)
            assignment.Priority = input.Priority;

        if (input.Deadline.HasValue)
            assignment.Deadline = input.Deadline;

        assignment.UpdatedAt = DateTime.UtcNow;

        await _teamAssignmentRepository.UpdateAsync(assignment);
    }

    public async Task DeleteAsync(int id)
    {
        await _teamAssignmentRepository.DeleteAsync(id);
    }

    private static TeamAssignmentResponse MapToResponse(TeamAssignment a) =>
        new(
            a.Id,
            a.Name,
            a.Description,
            a.TeamId,
            a.StatusId,
            a.Status?.Name ?? string.Empty,
            a.UserId,
            a.User?.Username,
            a.Priority,
            a.Deadline,
            a.CreatedAt,
            a.UpdatedAt
        );
}