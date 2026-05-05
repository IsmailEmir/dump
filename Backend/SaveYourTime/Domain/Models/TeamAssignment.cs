namespace WebApplication1.Domain.Models;

public class TeamAssignment
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }

    public int TeamId { get; set; }
    public Team Team { get; set; } = null!;

    public int StatusId { get; set; }
    public AssignmentStatus Status { get; set; } = null!;

    public int? UserId { get; set; }
    public User? User { get; set; }

    public string? Priority { get; set; }
    public DateTime? Deadline { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
}