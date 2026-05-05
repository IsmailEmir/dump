namespace WebApplication1.Domain.Models;

public class AssignmentStatus
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty; 
    public ICollection<Assignment> Assignments { get; set; } = new List<Assignment>();
    public ICollection<TeamAssignment> TeamAssignments { get; set; } = new List<TeamAssignment>();
}