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

            // Быстрый "страховочный" патч схемы: если миграции по какой-то причине не применились,
            // добавляем новые колонки idempotent-образом, чтобы приложение не падало.
            context.Database.ExecuteSqlRaw("""
                ALTER TABLE "TeamAssignments"
                ADD COLUMN IF NOT EXISTS "UpdatedAt" timestamp with time zone NULL;
                """);
            context.Database.ExecuteSqlRaw("""
                ALTER TABLE "Assignments"
                ADD COLUMN IF NOT EXISTS "UpdatedAt" timestamp with time zone NULL;
                """);
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