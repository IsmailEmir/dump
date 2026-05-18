using WebApplication1.Domain.Models;

namespace WebApplication1.Domain.Interfaces.Repositories;

public interface IAssignmentStatusRepository
{
    Task<IEnumerable<AssignmentStatus>> GetAllAsync();
    Task<AssignmentStatus?> GetByIdAsync(int? id);
}