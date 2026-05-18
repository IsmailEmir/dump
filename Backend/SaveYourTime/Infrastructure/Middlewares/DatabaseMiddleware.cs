using WebApplication1.Infrastructure.Contexts;
using Microsoft.EntityFrameworkCore;

namespace WebApplication1.Infrastructure.Middlewares;

public static class DatabaseMiddleware
{
    public static WebApplication UseDatabase(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();
        var services = scope.ServiceProvider;
        
        try
        {
            var context = services.GetRequiredService<ApplicationDbContext>();
            context.Database.Migrate();
        }
        catch (Exception ex)
        {
            var logger = services.GetRequiredService<ILogger<Program>>();
            logger.LogError(ex, "Database initialization error");
            throw;
        }
        
        return app;
    }
}