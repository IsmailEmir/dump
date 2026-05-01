using WebApplication1.Application.DTOs.Inputs;
using WebApplication1.Application.DTOs.Responses;
using WebApplication1.Domain.Interfaces.Repositories;
using WebApplication1.Domain.Interfaces.Services;
using WebApplication1.Domain.Models;
using WebApplication1.Infrastructure.Utils;

namespace WebApplication1.Application.Services;

public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;
    private readonly IRoleRepository _roleRepository;
    private readonly ITeamRepository _teamRepository;

    public UserService(
        IUserRepository userRepository,
        IRoleRepository roleRepository,
        ITeamRepository teamRepository)
    {
        _userRepository = userRepository;
        _roleRepository = roleRepository;
        _teamRepository = teamRepository;
    }


    public async Task<UserResponse?> GetByIdAsync(int id)
    {
        var user = await _userRepository.GetByIdAsync(id);
        return user == null ? null : MapToResponse(user);
    }

    public async Task<IEnumerable<UserResponse>> GetAllUsersAsync()
    {
        var users =  _userRepository.GetAllAsync().ToArray();
        return users.Select(MapToResponse);
    }

    public async Task<IEnumerable<UserResponse>> GetByFilterAsync(string? username, int? roleId)
    {
        var users = await _userRepository.GetByFilterAsync(username, roleId);
        return users.Select(MapToResponse);
    }

    public async Task CreateAsync(UserInput input)
    {
        if (await _userRepository.ExistsByUsernameAsync(input.Username))
            throw new Exception("Пользователь с таким именем уже существует");

        if (await _userRepository.ExistsByEmailAsync(input.Email))
            throw new Exception("Email уже зарегистрирован");
        
        var user = new User
        {
            Username = input.Username,
            Email = input.Email,
            PasswordHash = PasswordHasher.Hash(input.Password),
            RoleId = 2,
            CreatedAt = DateTime.UtcNow
        };
        
        await _userRepository.CreateAsync(user);
    }

    public async Task UpdateAsync(UserInput input)
    {
        var user = await _userRepository.GetByIdAsync(input.UserId);
        if (user == null)
            throw new Exception("Пользователь не найден");

        user.Username = input.Username;
        user.Email = input.Email;
        user.RoleId = input.RoleId;

        await _userRepository.UpdateAsync(user);
    }

    public async Task DeleteAsync(int id)
    {
        await _userRepository.DeleteAsync(id);
    }

    public async Task ChangeUserRoleAsync(int userId, int roleId)
    {
        var role = await _roleRepository.GetByIdAsync(roleId);
        if (role == null)
            throw new Exception("Роль не найдена");
        
        await _userRepository.ChangeRoleAsync(userId, roleId);
    }

    private UserResponse MapToResponse(User user)
    {
        var completedCount = user.Assignments?.Count(a => a.StatusId == 3) ?? 0;
        return new UserResponse(
            user.Id,
            user.Username,
            user.Email,
            user.CreatedAt,
            completedCount
        );
    }
}