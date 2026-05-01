using WebApplication1.Domain.Models;

namespace WebApplication1.Domain.Interfaces.Repositories;

public interface IUserRepository
{
    Task<User?> GetByIdAsync(int? id);
    IQueryable<User> GetAllAsync();
    Task<IEnumerable<User>> GetByFilterAsync(string? username, int? roleId);
    Task CreateAsync(User user);
    Task UpdateAsync(User user);
    Task DeleteAsync(int id);
    Task ChangeRoleAsync(int userId, int? roleId);
    
    Task<User?> GetByEmailAsync(string email);
    Task<bool> ExistsByUsernameAsync(string username);
    Task<bool> ExistsByEmailAsync(string email);
    Task UpdateLastLoginAsync(int userId);
}