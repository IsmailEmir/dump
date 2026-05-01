namespace WebApplication1.Domain.Models;

public class Team
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int LeaderId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public User? Leader { get; set; }
    public ICollection<User> Members { get; set; } = new List<User>();
    public ICollection<Assignment> Assignments { get; set; } = new List<Assignment>();
}