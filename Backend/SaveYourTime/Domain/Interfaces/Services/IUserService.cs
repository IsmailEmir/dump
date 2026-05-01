using WebApplication1.Application.DTOs.Inputs;
using WebApplication1.Application.DTOs.Responses;

namespace WebApplication1.Domain.Interfaces.Services;

public interface IUserService
{
    Task<UserResponse?> GetByIdAsync(int id);
    Task<IEnumerable<UserResponse>> GetAllUsersAsync();
    Task<IEnumerable<UserResponse>> GetByFilterAsync(string? username, int? roleId);
    
    Task CreateAsync(UserInput input);
    Task UpdateAsync(UserInput input);
    Task DeleteAsync(int id);
    Task ChangeUserRoleAsync(int userId, int roleId);
}