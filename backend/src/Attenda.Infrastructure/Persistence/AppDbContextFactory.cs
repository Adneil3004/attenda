using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Attenda.Infrastructure.Persistence;

namespace Attenda.Infrastructure.Persistence;

/// <summary>
/// Design-time factory for creating AppDbContext instances.
/// Required by EF Core tools (migrations, scaffholding).
/// </summary>
public class AppDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
{
    public AppDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();
        
        // Use a placeholder connection string for migrations
        // The actual connection is loaded from environment variables at runtime
        optionsBuilder.UseNpgsql(Environment.GetEnvironmentVariable("DATABASE_URL") 
            ?? "Host=localhost;Database=attenda;Username=postgres;Password=postgres");
        
        return new AppDbContext(optionsBuilder.Options);
    }
}
