using WebApplication1.Application.DTOs.Inputs;
using WebApplication1.Application.DTOs.Inputs.Assigments;
using WebApplication1.Application.DTOs.Responses;

namespace WebApplication1.Domain.Interfaces.Services;

public interface IAssignmentService
{
    Task<IEnumerable<AssignmentResponse>> GetAllAsync();
    Task<AssignmentResponse?> GetByIdAsync(int id);
    Task<IEnumerable<AssignmentResponse>> GetByFilterAsync(FilterAssigmentInput input);
    
    Task<int> CreateAsync(AssignmentInput input);
    Task UpdateAsync(ChangeAssigmentInput input);
    Task DeleteAsync(int id);
    Task UpdateStatusAsync(int assignmentId, string status);
    Task ChangeOwnerAsync(int assignmentId, int newUserId);
}