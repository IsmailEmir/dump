using WebApplication1.Application.DTOs.Inputs;
using WebApplication1.Application.DTOs.Inputs.Assigments;
using WebApplication1.Application.DTOs.Responses;
using WebApplication1.Domain.Interfaces.Repositories;
using WebApplication1.Domain.Interfaces.Services;
using WebApplication1.Domain.Models;

namespace WebApplication1.Application.Services;

public class AssignmentService : IAssignmentService
{
    private readonly IAssignmentRepository _assignmentRepository;
    private readonly IUserRepository _userRepository;
    private readonly IAssignmentPriorityRepository _priorityRepository;
    private readonly ICurrentUserService _currentUserService;
    private readonly ILogger<AssignmentService> _logger;
    
    public AssignmentService(
        IAssignmentRepository assignmentRepository,
        IUserRepository userRepository,
        IAssignmentPriorityRepository priorityRepository,
        ICurrentUserService currentUserService,
        ILogger<AssignmentService> logger)
    {
        _assignmentRepository = assignmentRepository;
        _userRepository = userRepository;
        _priorityRepository = priorityRepository;
        _currentUserService = currentUserService;
        _logger = logger;
    }

    public async Task<IEnumerable<AssignmentResponse>> GetAllAsync()
    {
        var currentUserId = _currentUserService.GetCurrentUserId()
                            ?? throw new UnauthorizedAccessException("Пользователь не аутентифицирован");

        var assignments = await _assignmentRepository.GetByUserIdAsync(currentUserId);
        return assignments.Select(MapToResponse);
    }

    public async Task<AssignmentResponse?> GetByIdAsync(int id)
    {
        var assignment = await _assignmentRepository.GetByIdAsync(id);
        return assignment == null ? null : MapToResponse(assignment);
    }

    public async Task<IEnumerable<AssignmentResponse>> GetByFilterAsync(FilterAssigmentInput input)
    {
        var assignments = _assignmentRepository
            .GetByFilterAsync(input.UserId, input.Filter)
            .AsEnumerable();
        return assignments.Select(MapToResponse);
    }

    public async Task<int> CreateAsync(AssignmentInput input)
    {
        var currentUserId = _currentUserService.GetCurrentUserId()
                            ?? throw new UnauthorizedAccessException("Пользователь не аутентифицирован");

        _logger.LogInformation("Creating assignment for user {UserId}: {Title}", currentUserId, input.Title);

        int priorityId = input.Priority switch
        {
            "low" => 1,
            "medium" => 2,
            "high" => 3,
            _ => 2
        };

        var assignment = new Assignment
        {
            Title = input.Title,
            Description = input.Description,
            UserId = currentUserId,
            StatusId = 1, // статус новая по умолчанию
            PriorityId = priorityId,
            Deadline = input.Deadline,
            CreatedAt = DateTime.UtcNow
        };

        await _assignmentRepository.CreateAsync(assignment);
        
        _logger.LogInformation("Assignment created with ID {AssignmentId}", assignment.Id);
        
        return assignment.Id;
    }

    public async Task UpdateAsync(ChangeAssigmentInput input)
    {
        var assignment = await _assignmentRepository.GetByIdAsync(input.AssigmentId);
        if (assignment == null)
            throw new Exception("Задача не найдена");

        assignment.Title = input.Title;
        assignment.Description = input.Description;
        assignment.PriorityId = MapPriority(input.Priority);
        assignment.Deadline = input.Deadline;

        await _assignmentRepository.UpdateAsync(assignment);
    }

    public async Task DeleteAsync(int id)
    {
        await _assignmentRepository.DeleteAsync(id);
    }

    public async Task UpdateStatusAsync(int assignmentId, string status)
    {
        int statusId = MapPriority(status);

        await _assignmentRepository.UpdateStatusAsync(assignmentId, statusId);
    }

    public async Task ChangeOwnerAsync(int assignmentId, int newUserId)
    {
        var assignment = await _assignmentRepository.GetByIdAsync(assignmentId);
        if (assignment == null)
            throw new Exception("Задача не найдена");

        var user = await _userRepository.GetByIdAsync(newUserId);
        if (user == null)
            throw new Exception("Пользователь не найден");

        await _assignmentRepository.ChangeOwnerAsync(assignmentId, newUserId);
    }

    private AssignmentResponse MapToResponse(Assignment a)
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

    private int MapPriority(string priority)
    {
        return priority switch
        {
            "low" => 1,
            "medium" => 2,
            "high" => 3,
            _ => 2
        };
    }
}