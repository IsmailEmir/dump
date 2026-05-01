using WebApplication1.Application.DTOs.Inputs;
using WebApplication1.Application.DTOs.Responses;

namespace WebApplication1.Domain.Interfaces.Services;

public interface IRoleService
{
    Task<IEnumerable<RoleResponse>> GetAllAsync();
    Task<RoleResponse?> GetByIdAsync(int id);
    Task<IEnumerable<RoleResponse>> GetByFilterAsync(string filter);
    
    Task CreateAsync(EditRoleInput input);
    Task UpdateAsync(RoleInput input);
    Task DeleteAsync(int id);
}