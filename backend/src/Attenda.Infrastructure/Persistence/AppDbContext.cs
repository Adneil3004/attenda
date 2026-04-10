using Attenda.Domain.Aggregates.EventAggregate;
using Attenda.Domain.Aggregates.UserAggregate;
using Attenda.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Attenda.Infrastructure.Persistence;

public class AppDbContext : DbContext, IUnitOfWork
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Event> Events => Set<Event>();
    public DbSet<User> Users => Set<User>();
    public DbSet<Guest> Guests => Set<Guest>();
    public DbSet<GuestGroup> GuestGroups => Set<GuestGroup>();
    public DbSet<CheckIn> CheckIns => Set<CheckIn>();
    public DbSet<TaskItem> TaskItems => Set<TaskItem>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
        
        // Postgres snake_case convention (optional but common for Supabase/Postgres)
        foreach (var entity in modelBuilder.Model.GetEntityTypes())
        {
            entity.SetTableName(entity.GetTableName()?.ToLowerInvariant());
            foreach (var property in entity.GetProperties())
            {
                property.SetColumnName(property.Name.ToLowerInvariant());
            }
        }

        base.OnModelCreating(modelBuilder);
    }
}
