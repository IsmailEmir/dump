using WebApplication1.Domain.Models;

namespace WebApplication1.Domain.Interfaces.Repositories;

public interface IRoleRepository
{
    Task<IEnumerable<Role>> GetAllAsync();
    Task<Role?> GetByIdAsync(int id);
    IQueryable<Role> GetByFilterAsync(string filter);
    Task CreateAsync(Role role);
    Task DeleteAsync(int id);
    Task UpdateAsync(Role role);

    Task<int> GetDefaultRoleId();
}