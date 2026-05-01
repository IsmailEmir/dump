using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebApplication1.Application.DTOs.Inputs;
using WebApplication1.Application.DTOs.Inputs.Assigments;
using WebApplication1.Application.DTOs.Responses;
using WebApplication1.Domain.Interfaces.Services;

namespace WebApplication1.Application.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AssignmentController : ControllerBase
{
    private readonly IAssignmentService _assignmentService;

    public AssignmentController(IAssignmentService assignmentService) =>
        _assignmentService = assignmentService;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<AssignmentResponse>>> GetAll()
    {
        var all = await _assignmentService.GetAllAsync();
        return Ok(all);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<AssignmentResponse>> GetById(int id)
    {
        var assignment = await _assignmentService.GetByIdAsync(id);
        if (assignment == null) return NotFound($"Задача с ID {id} не найдена");
        
        return Ok(assignment);
    }

    [HttpGet("filter")]
    public async Task<ActionResult<IEnumerable<AssignmentResponse>>> GetByFilter(
        [FromQuery] FilterAssigmentInput input)
    {
        var assignments = await _assignmentService.GetByFilterAsync(input);
        return Ok(assignments);
    }

    [HttpPost]
    public async Task<ActionResult<int>> Create([FromBody] AssignmentInput input)
    {
        try
        {
            var newId = await _assignmentService.CreateAsync(input);
            return Created($"/api/Assignment/{newId}", newId);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(ex.Message);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPut]
    public async Task<ActionResult<AssignmentResponse>> Update([FromBody] ChangeAssigmentInput input)
    {
        try
        {
            await _assignmentService.UpdateAsync(input);
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
        await _assignmentService.DeleteAsync(id);
        return NoContent();
    }

    [HttpPatch("status")]
    public async Task<ActionResult<AssignmentResponse>> UpdateStatus
        (
             int assigmentId,
             string status
        )
    {
        try
        {
            await _assignmentService.UpdateStatusAsync(assigmentId, status);
            return Ok();
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPatch("owner")]
    public async Task<ActionResult<AssignmentResponse>> ChangeOwner
    (
        int assigmentId, 
        int newUserId)
    {
        try
        {
            await _assignmentService.ChangeOwnerAsync(assigmentId, newUserId);
            return Ok();
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
}

