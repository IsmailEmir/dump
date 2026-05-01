using Microsoft.EntityFrameworkCore;
using WebApplication1.Domain.Interfaces.Repositories;
using WebApplication1.Domain.Models;
using WebApplication1.Infrastructure.Contexts;

namespace WebApplication1.Infrastructure.Repositories;

public class AssignmentPriorityRepository : IAssignmentPriorityRepository
{
    private readonly ApplicationDbContext _context;

    public AssignmentPriorityRepository(ApplicationDbContext context) => _context = context;

    public async Task<IEnumerable<AssignmentPriority>> GetAllAsync() =>
        await _context.AssignmentPriorities.ToListAsync();

    public async Task<AssignmentPriority?> GetByIdAsync(int? id) =>
        await _context.AssignmentPriorities.FindAsync(id);
}