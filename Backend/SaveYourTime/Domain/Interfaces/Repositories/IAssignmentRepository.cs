using WebApplication1.Domain.Models;

namespace WebApplication1.Domain.Interfaces.Repositories;

public interface IAssignmentRepository
{
    Task<IEnumerable<Assignment>> GetAllAsync();
    Task<Assignment?> GetByIdAsync(int id);
    IQueryable<Assignment>GetByFilterAsync(int userId, string filter);
    
    Task CreateAsync(Assignment assignment);
    Task UpdateAsync(Assignment assignment);
    Task DeleteAsync(int id);
    Task UpdateStatusAsync(int assignmentId, int statusId);
    Task ChangeOwnerAsync(int assignmentId, int newUserId);
    Task<IEnumerable<Assignment>> GetByUserIdAsync(int userId);
}