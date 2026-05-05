using Microsoft.EntityFrameworkCore;
using WebApplication1.Domain.Interfaces.Repositories;
using WebApplication1.Domain.Models;
using WebApplication1.Infrastructure.Contexts;

namespace WebApplication1.Infrastructure.Repositories;

public class TeamAssignmentRepository : ITeamAssignmentRepository
{
    private readonly ApplicationDbContext _context;

    public TeamAssignmentRepository(ApplicationDbContext context) => _context = context;

    public async Task<IEnumerable<TeamAssignment>> GetByTeamIdAsync(int teamId) =>
        await _context.TeamAssignments
            .Include(a => a.Team)
            .Include(a => a.Status)
            .Include(a => a.User)
            .Where(a => a.TeamId == teamId)
            .OrderByDescending(a => a.CreatedAt)
            .ToListAsync();

    public async Task<TeamAssignment?> GetByIdAsync(int id) =>
        await _context.TeamAssignments
            .Include(a => a.Team)
            .Include(a => a.Status)
            .Include(a => a.User)
            .FirstOrDefaultAsync(a => a.Id == id);

    public async Task CreateAsync(TeamAssignment assignment)
    {
        _context.TeamAssignments.Add(assignment);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(TeamAssignment assignment)
    {
        _context.TeamAssignments.Update(assignment);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var assignment = await _context.TeamAssignments.FindAsync(id);
        if (assignment != null)
        {
            _context.TeamAssignments.Remove(assignment);
            await _context.SaveChangesAsync();
        }
    }
}

