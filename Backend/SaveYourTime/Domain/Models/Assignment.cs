namespace WebApplication1.Domain.Models;
public class Assignment
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int UserId { get; set; }
    public int StatusId { get; set; }
    public int PriorityId { get; set; }
    public DateTime? Deadline { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public User User { get; set; } = null!;
    public AssignmentStatus Status { get; set; } = null!;
    public AssignmentPriority Priority { get; set; } = null!;
}