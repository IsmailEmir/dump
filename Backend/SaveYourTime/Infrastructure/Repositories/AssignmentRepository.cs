using Microsoft.EntityFrameworkCore;
using WebApplication1.Domain.Interfaces.Repositories;
using WebApplication1.Domain.Models;
using WebApplication1.Infrastructure.Contexts;

namespace WebApplication1.Infrastructure.Repositories;

public class AssignmentRepository : IAssignmentRepository
{
    private readonly ApplicationDbContext _context;

    public AssignmentRepository(ApplicationDbContext context) => _context = context;

    public async Task<IEnumerable<Assignment>> GetAllAsync() =>
        await _context.Assignments
            .Include(a => a.User)
            .Include(a => a.Status)
            .Include(a => a.Priority)
            .ToListAsync();

    public async Task<Assignment?> GetByIdAsync(int id) =>
        await _context.Assignments
            .Include(a => a.User)
            .Include(a => a.Status)
            .Include(a => a.Priority)
            .FirstOrDefaultAsync(a => a.Id == id);

    public IQueryable<Assignment> GetByFilterAsync(int userId, string filter)
    {
        return  _context.Assignments
            .Include(a => a.User)
            .Include(a => a.Status)
            .Include(a => a.Priority)
            .AsQueryable();
    }

    public async Task CreateAsync(Assignment assignment)
    {
        _context.Assignments.Add(assignment);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(Assignment assignment)
    {
        _context.Assignments.Update(assignment);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var assignment = await _context.Assignments.FindAsync(id);
        if (assignment != null)
        {
            _context.Assignments.Remove(assignment);
            await _context.SaveChangesAsync();
        }
    }

    public async Task UpdateStatusAsync(int assignmentId, int statusId)
    {
        var assignment = await _context.Assignments.FindAsync(assignmentId);
        if (assignment != null)
        {
            assignment.StatusId = statusId;
            await _context.SaveChangesAsync();
        }
    }

    public async Task ChangeOwnerAsync(int assignmentId, int newUserId)
    {
        var assignment = await _context.Assignments.FindAsync(assignmentId);
        if (assignment != null)
        {
            assignment.UserId = newUserId;
            await _context.SaveChangesAsync();
        }
    }

    public async Task<IEnumerable<Assignment>> GetByUserIdAsync(int userId)
    {
        return await _context.Assignments
            .Include(a => a.User)
            .Include(a => a.Status)
            .Include(a => a.Priority)
            .Where(a => a.UserId == userId)
            .ToListAsync();
    }

    public async Task UpdateContentAsync(int assignmentId, string title, string? description)
    {
        var assignment = await _context.Assignments.FindAsync(assignmentId);
        if (assignment != null)
        {
            assignment.Title = title;
            assignment.Description = description;
            await _context.SaveChangesAsync();
        }
    }
}