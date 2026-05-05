using WebApplication1.Domain.Interfaces.Repositories;
using WebApplication1.Infrastructure.Repositories;

namespace WebApplication1.Infrastructure.Middlewares;

public static class RepositoriesMiddlewares
{
    public static void ConfigureRepositories(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IAssignmentRepository, AssignmentRepository>();
        services.AddScoped<IRoleRepository, RoleRepository>();
        services.AddScoped<ITeamRepository, TeamRepository>();
        services.AddScoped<ITeamAssignmentRepository, TeamAssignmentRepository>();
        services.AddScoped<IAssignmentStatusRepository, AssignmentStatusRepository>();
        services.AddScoped<IAssignmentPriorityRepository, AssignmentPriorityRepository>();
    }
}