using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebApplication1.Application.DTOs.Inputs;
using WebApplication1.Application.DTOs.Responses;
using WebApplication1.Domain.Interfaces.Services;

namespace WebApplication1.Application.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UserController : ControllerBase
{
    private readonly IUserService _userService;

    public UserController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<UserResponse>>> GetAll()
    {
        var users = await _userService.GetAllUsersAsync();
        return Ok(users);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<UserResponse>> GetById(int id)
    {
        var user = await _userService.GetByIdAsync(id);
        if (user == null)
            return NotFound($"Пользователь с ID {id} не найден");

        return Ok(user);
    }

    [HttpGet("filter")]
    public async Task<ActionResult<IEnumerable<UserResponse>>> GetByFilter(
        [FromQuery] FilterUserInput input)
    {
        var users = await _userService.GetByFilterAsync(input.Username, input.RoleId);
        return Ok(users);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] UserInput input)
    {
        await _userService.CreateAsync(input);
        return Created();
    }

    [HttpPut]
    public async Task<IActionResult> Update([FromBody] UserInput input)
    {
        await _userService.UpdateAsync(input);
        return Ok();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _userService.DeleteAsync(id);
        return NoContent();
    }

    [HttpPatch("{id}/role")]
    public async Task<ActionResult<UserResponse>> ChangeUserRole(int userId, [FromBody] int roleId)
    {
        await _userService.ChangeUserRoleAsync(userId, roleId);
        return Ok();
    }
}