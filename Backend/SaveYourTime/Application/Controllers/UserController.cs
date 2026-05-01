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
    public async Task<ActionResult<UserResponse>> GetById(int userId)
    {
        var user = await _userService.GetByIdAsync(userId);
        if (user == null)
            return NotFound($"Пользователь с ID {userId} не найден");
        
        return Ok(user);
    }

    [HttpGet("filter")]
    public async Task<ActionResult<IEnumerable<UserResponse>>> GetByFilter(
        [FromQuery] string username,
        [FromQuery] int? roleId)
    {
        var users = await _userService.GetByFilterAsync(username, roleId);
        return Ok(users);
    }
    
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] UserInput input)
    {
        try
        {
            await _userService.CreateAsync(input);
            return Created();
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPut]
    public async Task<IActionResult> Update([FromBody] UserInput input)
    {
        try
        {
            await _userService.UpdateAsync(input);
            return Ok();
        }
        catch (Exception ex)
        {
            return NotFound(ex.Message);
        }
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
        try
        {
            await _userService.ChangeUserRoleAsync(userId, roleId);
            return Ok();
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
}