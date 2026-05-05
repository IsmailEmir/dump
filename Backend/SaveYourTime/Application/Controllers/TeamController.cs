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
    private readonly IFileStorageService _fileStorageService;

    public TeamController(ITeamService teamService, IFileStorageService fileStorageService)
    {
        _teamService = teamService;
        _fileStorageService = fileStorageService;
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
    public async Task<ActionResult<IEnumerable<UserResponse>>> GetTeamUsers(int id)
    {
        var users = await _teamService.GetUsersInTeamAsync(id);
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

    [HttpPost("{id}/avatar")]
    [Consumes("multipart/form-data")]
    public async Task<ActionResult<TeamResponse>> UploadAvatar(int id, IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest("Файл не выбран");

        var team = await _teamService.GetByIdAsync(id);
        if (team == null)
            return NotFound($"Команда с ID {id} не найдена");

        // заменить старую картинку
        if (!string.IsNullOrWhiteSpace(team.AvatarUrl))
            await _fileStorageService.DeleteFileAsync(team.AvatarUrl);

        var avatarUrl = await _fileStorageService.SaveFileAsync(file, "teams");

        var update = new TeamInput(
            LeaderId: team.LeaderId ?? 0,
            teamId: id,
            Name: team.Name,
            Description: team.Description,
            AvatarUrl: avatarUrl
        );

        await _teamService.UpdateAsync(update);

        var updated = await _teamService.GetByIdAsync(id);
        return Ok(updated);
    }

    [HttpDelete("{id}/avatar")]
    public async Task<IActionResult> DeleteAvatar(int id)
    {
        var team = await _teamService.GetByIdAsync(id);
        if (team == null)
            return NotFound($"Команда с ID {id} не найдена");

        if (!string.IsNullOrWhiteSpace(team.AvatarUrl))
            await _fileStorageService.DeleteFileAsync(team.AvatarUrl);

        var update = new TeamInput(
            LeaderId: team.LeaderId ?? 0,
            teamId: id,
            Name: team.Name,
            Description: team.Description,
            AvatarUrl: null
        );

        await _teamService.UpdateAsync(update);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _teamService.DeleteAsync(id);
        return NoContent();
    }

    [HttpPost("{id}/users/{userId}")]
    public async Task<ActionResult> AddUser(int id, int userId)
    {
        try
        {
            await _teamService.AddUserToTeamAsync(userId, id);
            return Ok();
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpDelete("{id}/users/{userId}")]
    public async Task<ActionResult> RemoveUserFromTeam(int id, int userId)
    {
        try
        {
            await _teamService.RemoveUserFromTeamAsync(id, userId);
            return Ok();
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPatch("{id}/leader/{userId}")]
    public async Task<ActionResult> SetLeader(int id, int userId)
    {
        try
        {
            await _teamService.SetTeamLeaderAsync(id, userId);
            return Ok();
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
}