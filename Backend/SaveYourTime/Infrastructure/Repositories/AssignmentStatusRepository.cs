using Microsoft.EntityFrameworkCore;
using WebApplication1.Domain.Interfaces.Repositories;
using WebApplication1.Domain.Models;
using WebApplication1.Infrastructure.Contexts;

namespace WebApplication1.Infrastructure.Repositories;

public class AssignmentStatusRepository : IAssignmentStatusRepository
{
    private readonly ApplicationDbContext _context;

    public AssignmentStatusRepository(ApplicationDbContext context) => _context = context;

    public async Task<IEnumerable<AssignmentStatus>> GetAllAsync() =>
        await _context.AssignmentStatuses.ToListAsync();

    public async Task<AssignmentStatus?> GetByIdAsync(int? id) =>
        await _context.AssignmentStatuses.FindAsync(id);
}