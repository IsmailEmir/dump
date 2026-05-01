using Microsoft.EntityFrameworkCore;
using WebApplication1.Domain.Models;

namespace WebApplication1.Infrastructure.Contexts;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Role> Roles => Set<Role>();
    public DbSet<Team> Teams => Set<Team>();
    public DbSet<Assignment> Assignments => Set<Assignment>();
    public DbSet<AssignmentStatus> AssignmentStatuses => Set<AssignmentStatus>();
    public DbSet<AssignmentPriority> AssignmentPriorities => Set<AssignmentPriority>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Role>().HasData(
            new Role { Id = 1, Name = "admin", Description = "Administrator" },
            new Role { Id = 2, Name = "User", Description = "Regular user" }
        );
        
        modelBuilder.Entity<AssignmentStatus>().HasData(
            new AssignmentStatus { Id = 1, Name = "todo" },
            new AssignmentStatus { Id = 2, Name = "in-progress" },
            new AssignmentStatus { Id = 3, Name = "done" }
        );
        modelBuilder.Entity<AssignmentPriority>().HasData(
            new AssignmentPriority { Id = 1, Name = "low" },
            new AssignmentPriority { Id = 2, Name = "medium" },
            new AssignmentPriority { Id = 3, Name = "high" }
        );


        modelBuilder.Entity<User>()
            .HasMany(t => t.Teams)
            .WithMany(t => t.Members);
        
        modelBuilder.Entity<User>()
            .HasOne(u => u.Role)
            .WithMany(r => r.Users)
            .HasForeignKey(u => u.RoleId)
            .OnDelete(DeleteBehavior.SetNull);

        modelBuilder.Entity<Team>()
            .HasOne(t => t.Leader)
            .WithMany(u => u.LeadingTeams)
            .HasForeignKey(t => t.LeaderId)
            .OnDelete(DeleteBehavior.SetNull);
        
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email).IsUnique();
        
        
        modelBuilder.Entity<Assignment>()
            .HasOne(a => a.User)
            .WithMany(u => u.Assignments)
            .HasForeignKey(a => a.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Assignment>()
            .HasOne(a => a.Status)
            .WithMany(s => s.Assignments)
            .HasForeignKey(a => a.StatusId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Assignment>()
            .HasOne(a => a.Priority)
            .WithMany(p => p.Assignments)
            .HasForeignKey(a => a.PriorityId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}