using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebApplication1.Application.DTOs.Inputs.TeamAssignments;
using WebApplication1.Application.DTOs.Responses;
using WebApplication1.Domain.Interfaces.Services;

namespace WebApplication1.Application.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TeamAssignmentController : ControllerBase
{
    private readonly ITeamAssignmentService _teamAssignmentService;

    public TeamAssignmentController(ITeamAssignmentService teamAssignmentService) =>
        _teamAssignmentService = teamAssignmentService;

    [HttpGet("team/{teamId}")]
    public async Task<ActionResult<IEnumerable<TeamAssignmentResponse>>> GetByTeamId(int teamId)
    {
        var assignments = await _teamAssignmentService.GetByTeamIdAsync(teamId);
        return Ok(assignments);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TeamAssignmentResponse>> GetById(int id)
    {
        var assignment = await _teamAssignmentService.GetByIdAsync(id);
        if (assignment == null)
            return NotFound($"Командная задача с ID {id} не найдена");

        return Ok(assignment);
    }

    [HttpPost]
    public async Task<ActionResult<int>> Create([FromBody] CreateTeamAssignmentInput input)
    {
        var newId = await _teamAssignmentService.CreateAsync(input);
        return Created($"/api/TeamAssignment/{newId}", newId);
    }

    [HttpPut]
    public async Task<ActionResult> Update([FromBody] UpdateTeamAssignmentInput input)
    {
        await _teamAssignmentService.UpdateAsync(input);
        return Ok();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _teamAssignmentService.DeleteAsync(id);
        return NoContent();
    }
}

