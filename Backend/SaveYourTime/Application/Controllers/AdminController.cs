using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebApplication1.Application.DTOs.Inputs;
using WebApplication1.Application.DTOs.Inputs.Assigments;
using WebApplication1.Application.DTOs.Inputs.TeamAssignments;
using WebApplication1.Application.DTOs.Responses;
using WebApplication1.Domain.Interfaces.Services;

namespace WebApplication1.Application.Controllers;

[ApiController]
[Route("api/admin")]
[Authorize(Roles = "Admin")]
public class AdminController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly IRoleService _roleService;
    private readonly IAssignmentService _assignmentService;
    private readonly ITeamService _teamService;
    private readonly ITeamAssignmentService _teamAssignmentService;

    public AdminController(
        IUserService userService,
        IRoleService roleService,
        IAssignmentService assignmentService,
        ITeamService teamService,
        ITeamAssignmentService teamAssignmentService)
    {
        _userService = userService;
        _roleService = roleService;
        _assignmentService = assignmentService;
        _teamService = teamService;
        _teamAssignmentService = teamAssignmentService;
    }
    
    [HttpGet("stats")]
    public async Task<ActionResult<object>> GetStats()
    {
        var users = await _userService.GetAllUsersAsync();
        var roles = await _roleService.GetAllAsync();
        var assignments = await _assignmentService.GetAllAsync();
        var teams = await _teamService.GetAllAsync();

        return Ok(new
        {
            UsersCount = users.Count(),
            RolesCount = roles.Count(),
            AssignmentsCount = assignments.Count(),
            TeamsCount = teams.Count()
        });
    }

    [HttpGet("users")]
    public async Task<ActionResult<IEnumerable<UserResponse>>> GetAllUsers()
    {
        var users = await _userService.GetAllUsersAsync();
        return Ok(users);
    }

    [HttpGet("users/{id}")]
    public async Task<ActionResult<UserResponse>> GetUserById(int id)
    {
        var user = await _userService.GetByIdAsync(id);
        if (user == null)
            return NotFound($"Пользователь с ID {id} не найден");

        return Ok(user);
    }

    [HttpGet("users/filter")]
    public async Task<ActionResult<IEnumerable<UserResponse>>> GetUsersByFilter(
        [FromQuery] string? username,
        [FromQuery] int? roleId)
    {
        var users = await _userService.GetByFilterAsync(username, roleId);
        return Ok(users);
    }

    [HttpPost("users")]
    public async Task<IActionResult> CreateUser([FromBody] UserInput input)
    {
        await _userService.CreateAsync(input);
        return Created();
    }

    [HttpPut("users")]
    public async Task<IActionResult> UpdateUser([FromBody] UserInput input)
    {
        await _userService.UpdateAsync(input);
        return Ok();
    }

    [HttpDelete("users/{id}")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        await _userService.DeleteAsync(id);
        return NoContent();
    }

    [HttpPatch("users/{id}/role")]
    public async Task<ActionResult> ChangeUserRole(int id, [FromBody] int roleId)
    {
        await _userService.ChangeUserRoleAsync(id, roleId);
        return Ok();
    }

    [HttpGet("roles")]
    public async Task<ActionResult<IEnumerable<RoleResponse>>> GetAllRoles()
    {
        var roles = await _roleService.GetAllAsync();
        return Ok(roles);
    }

    [HttpGet("roles/{id}")]
    public async Task<ActionResult<RoleResponse>> GetRoleById(int id)
    {
        var role = await _roleService.GetByIdAsync(id);
        if (role == null)
            return NotFound($"Роль с ID {id} не найдена");

        return Ok(role);
    }

    [HttpGet("roles/filter")]
    public async Task<ActionResult<IEnumerable<RoleResponse>>> GetRolesByFilter([FromQuery] string filter)
    {
        var roles = await _roleService.GetByFilterAsync(filter);
        return Ok(roles);
    }

    [HttpPost("roles")]
    public async Task<ActionResult> CreateRole([FromBody] EditRoleInput input)
    {
        await _roleService.CreateAsync(input);
        return Ok();
    }

    [HttpPut("roles")]
    public async Task<ActionResult> UpdateRole([FromBody] RoleInput input)
    {
        await _roleService.UpdateAsync(input);
        return Ok();
    }

    [HttpDelete("roles/{id}")]
    public async Task<IActionResult> DeleteRole(int id)
    {
        await _roleService.DeleteAsync(id);
        return NoContent();
    }

    [HttpGet("assignments")]
    public async Task<ActionResult<IEnumerable<AssignmentResponse>>> GetAllAssignments()
    {
        var assignments = await _assignmentService.GetAllAsync();
        return Ok(assignments);
    }

    [HttpGet("assignments/{id}")]
    public async Task<ActionResult<AssignmentResponse>> GetAssignmentById(int id)
    {
        var assignment = await _assignmentService.GetByIdAsync(id);
        if (assignment == null)
            return NotFound($"Задача с ID {id} не найдена");

        return Ok(assignment);
    }

    [HttpGet("assignments/filter")]
    public async Task<ActionResult<IEnumerable<AssignmentResponse>>> GetAssignmentsByFilter(
        [FromQuery] FilterAssigmentInput input)
    {
        var assignments = await _assignmentService.GetByFilterAsync(input);
        return Ok(assignments);
    }

    [HttpPost("assignments")]
    public async Task<ActionResult<int>> CreateAssignment([FromBody] AssignmentInput input)
    {
        var newId = await _assignmentService.CreateAsync(input);
        return Created($"/api/admin/assignments/{newId}", newId);
    }

    [HttpPut("assignments")]
    public async Task<ActionResult> UpdateAssignment([FromBody] ChangeAssigmentInput input)
    {
        await _assignmentService.UpdateAsync(input);
        return Ok();
    }

    [HttpDelete("assignments/{id}")]
    public async Task<IActionResult> DeleteAssignment(int id)
    {
        await _assignmentService.DeleteAsync(id);
        return NoContent();
    }

    [HttpPatch("assignments/{id}/status")]
    public async Task<ActionResult> UpdateAssignmentStatus(int id, [FromBody] string status)
    {
        await _assignmentService.UpdateStatusAsync(id, status);
        return Ok();
    }

    [HttpPatch("assignments/{id}/owner")]
    public async Task<ActionResult> ChangeAssignmentOwner(int id, [FromBody] int newUserId)
    {
        await _assignmentService.ChangeOwnerAsync(id, newUserId);
        return Ok();
    }

    [HttpGet("teams")]
    public async Task<ActionResult<IEnumerable<TeamResponse>>> GetAllTeams()
    {
        var teams = await _teamService.GetAllAsync();
        return Ok(teams);
    }

    [HttpGet("teams/{id}")]
    public async Task<ActionResult<TeamResponse>> GetTeamById(int id)
    {
        var team = await _teamService.GetByIdAsync(id);
        if (team == null)
            return NotFound($"Команда с ID {id} не найдена");

        return Ok(team);
    }

    [HttpGet("teams/{id}/users")]
    public async Task<ActionResult<IEnumerable<UserResponse>>> GetTeamUsers(int id)
    {
        var users = await _teamService.GetUsersInTeamAsync(id);
        return Ok(users);
    }

    [HttpPost("teams")]
    public async Task<ActionResult> CreateTeam([FromBody] TeamInput input)
    {
        await _teamService.CreateAsync(input);
        return Ok();
    }

    [HttpPut("teams")]
    public async Task<ActionResult> UpdateTeam([FromBody] TeamInput input)
    {
        await _teamService.UpdateAsync(input);
        return Ok();
    }

    [HttpDelete("teams/{id}")]
    public async Task<IActionResult> DeleteTeam(int id)
    {
        await _teamService.DeleteAsync(id);
        return NoContent();
    }

    [HttpPost("teams/{teamId}/users/{userId}")]
    public async Task<ActionResult> AddUserToTeam(int teamId, int userId)
    {
        await _teamService.AddUserToTeamAsync(userId, teamId);
        return Ok();
    }

    [HttpDelete("teams/{teamId}/users/{userId}")]
    public async Task<ActionResult> RemoveUserFromTeam(int teamId, int userId)
    {
        await _teamService.RemoveUserFromTeamAsync(teamId, userId);
        return Ok();
    }

    [HttpPatch("teams/{teamId}/leader/{userId}")]
    public async Task<ActionResult> SetTeamLeader(int teamId, int userId)
    {
        await _teamService.SetTeamLeaderAsync(teamId, userId);
        return Ok();
    }

    [HttpGet("team-assignments/{teamId}")]
    public async Task<ActionResult<IEnumerable<TeamAssignmentResponse>>> GetTeamAssignmentsByTeam(int teamId)
    {
        var assignments = await _teamAssignmentService.GetByTeamIdAsync(teamId);
        return Ok(assignments);
    }

    [HttpGet("team-assignments/detail/{id}")]
    public async Task<ActionResult<TeamAssignmentResponse>> GetTeamAssignmentById(int id)
    {
        var assignment = await _teamAssignmentService.GetByIdAsync(id);
        if (assignment == null)
            return NotFound($"Командная задача с ID {id} не найдена");

        return Ok(assignment);
    }

    [HttpPost("team-assignments")]
    public async Task<ActionResult<int>> CreateTeamAssignment([FromBody] CreateTeamAssignmentInput input)
    {
        var newId = await _teamAssignmentService.CreateAsync(input);
        return Created($"/api/admin/team-assignments/{newId}", newId);
    }

    [HttpPut("team-assignments")]
    public async Task<ActionResult> UpdateTeamAssignment([FromBody] UpdateTeamAssignmentInput input)
    {
        await _teamAssignmentService.UpdateAsync(input);
        return Ok();
    }

    [HttpDelete("team-assignments/{id}")]
    public async Task<IActionResult> DeleteTeamAssignment(int id)
    {
        await _teamAssignmentService.DeleteAsync(id);
        return NoContent();
    }
}