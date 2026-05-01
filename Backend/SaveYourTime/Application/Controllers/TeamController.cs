using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebApplication1.Application.DTOs.Inputs;
using WebApplication1.Application.DTOs.Responses;
using WebApplication1.Domain.Interfaces.Services;

namespace WebApplication1.Application.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TeamController : ControllerBase
{
    private readonly ITeamService _teamService;

    public TeamController(ITeamService teamService)
    {
        _teamService = teamService;
    }
    
    [HttpGet]
    public async Task<ActionResult<IEnumerable<TeamResponse>>> GetAll()
    {
        var teams = await _teamService.GetAllAsync();
        return Ok(teams);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TeamResponse>> GetById(int id)
    {
        var team = await _teamService.GetByIdAsync(id);
        if (team == null)
            return NotFound($"Команда с ID {id} не найдена");
        
        return Ok(team);
    }

    [HttpGet("{id}/users")]
    public async Task<ActionResult<IEnumerable<UserResponse>>> GetTeamUsers(int teamId)
    {
        var users = await _teamService.GetUsersInTeamAsync(teamId);
        return Ok(users);
    }

    [HttpGet("{id}/assignments")]
    public async Task<ActionResult<IEnumerable<AssignmentResponse>>> GetTeamAssigmentsAssignments(int id)
    {
        //TODO тот самый TeamAssigment
        // var assignments = await _teamService.GetAssignmentsInTeamAsync(id);
        return Ok();
    }
    
    [HttpPost]
    public async Task<ActionResult> Create([FromBody] TeamInput input)
    {
        try
        {
            await _teamService.CreateAsync(input);
            return Ok();
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPut]
    public async Task<ActionResult> Update([FromBody] TeamInput input)
    {
        try
        {
            await _teamService.UpdateAsync(input);
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
        await _teamService.DeleteAsync(id);
        return NoContent();
    }

    [HttpPost("{id}/users/{userId}")]
    public async Task<ActionResult> AddUser(int teamId, string email)
    {
        try
        {
            await _teamService.AddUserToTeamAsync(email, teamId);
            return Ok();
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpDelete("{id}/users/{userId}")]
    public async Task<ActionResult> RemoveUserFromTeam(int teamId, int userId)
    {
        try
        {
            await _teamService.RemoveUserFromTeamAsync(teamId, userId);
            return Ok();
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPatch("{id}/leader/{userId}")]
    public async Task<ActionResult> SetLeader(int teamId, int userId)
    {
        try
        {
            await _teamService.SetTeamLeaderAsync(teamId, userId);
            return Ok();
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
}