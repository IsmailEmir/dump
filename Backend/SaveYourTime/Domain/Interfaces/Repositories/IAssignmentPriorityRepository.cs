using WebApplication1.Domain.Models;

namespace WebApplication1.Domain.Interfaces.Repositories;

public interface IAssignmentPriorityRepository
{
    Task<IEnumerable<AssignmentPriority>> GetAllAsync();
    Task<AssignmentPriority?> GetByIdAsync(int? id);
}