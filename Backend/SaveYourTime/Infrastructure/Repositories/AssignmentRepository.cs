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
        var query = _context.Assignments
            .Include(a => a.User)
            .Include(a => a.Status)
            .Include(a => a.Priority)
            .AsQueryable();

        query = query.Where(a => a.UserId == userId);

        if (string.IsNullOrWhiteSpace(filter))
            return query;

        var f = filter.Trim().ToLowerInvariant();

        // Полнотекстового поиска тут нет — делаем простой, но полезный матч:
        // - Title/Description содержит строку
        // - или точное совпадение по имени статуса/приоритета
        return query.Where(a =>
            a.Title.ToLower().Contains(f) ||
            (a.Description != null && a.Description.ToLower().Contains(f)) ||
            a.Status.Name.ToLower() == f ||
            a.Priority.Name.ToLower() == f
        );
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