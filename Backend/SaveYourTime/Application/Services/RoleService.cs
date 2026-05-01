using WebApplication1.Application.DTOs.Inputs;
using WebApplication1.Application.DTOs.Responses;
using WebApplication1.Domain.Interfaces.Repositories;
using WebApplication1.Domain.Interfaces.Services;
using WebApplication1.Domain.Models;

namespace WebApplication1.Application.Services;

public class RoleService : IRoleService
{
    private readonly IRoleRepository _roleRepository;

    public RoleService(IRoleRepository roleRepository)
    {
        _roleRepository = roleRepository;
    }
    
    public async Task<IEnumerable<RoleResponse>> GetAllAsync()
    {
        var roles = await _roleRepository.GetAllAsync();
        return roles.Select(MapToResponse);
    }

    public async Task<RoleResponse?> GetByIdAsync(int id)
    {
        var role = await _roleRepository.GetByIdAsync(id);
        return role == null ? null : MapToResponse(role);
    }

    public async Task<IEnumerable<RoleResponse>> GetByFilterAsync(string filter)
    {
        var roles = _roleRepository.GetByFilterAsync(filter).AsEnumerable();
        return roles.Select(MapToResponse);
    }
    
    public async Task CreateAsync(EditRoleInput input)
    {
        var role = new Role
        {
            Name = input.Name,
            Description = input.Description
        };

        await _roleRepository.CreateAsync(role);
    }

    public async Task UpdateAsync(RoleInput input)
    {
        var role = await _roleRepository.GetByIdAsync(input.Id);
        if (role == null)
            throw new Exception("Роль не найдена");

        role.Name = input.Name;
        role.Description = input.Description;

        await _roleRepository.UpdateAsync(role);
    }

    public async Task DeleteAsync(int id)
    {
        await _roleRepository.DeleteAsync(id);
    }
    
    private RoleResponse MapToResponse(Role role)
    {
        return new RoleResponse(
            role.Id,
            role.Name,
            role.Description
        );
    }
}