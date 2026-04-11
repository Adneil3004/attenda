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
        
        foreach (var entity in modelBuilder.Model.GetEntityTypes())
        {
            // Nombres de Tablas
            entity.SetTableName(ToSnakeCase(entity.GetTableName()));

            // Nombres de Columnas
            foreach (var property in entity.GetProperties())
            {
                property.SetColumnName(ToSnakeCase(property.Name));
            }

            // Nombres de Primary Keys
            foreach (var key in entity.GetKeys())
            {
                key.SetName(ToSnakeCase(key.GetName()));
            }

            // Nombres de Foreign Keys
            foreach (var key in entity.GetForeignKeys())
            {
                key.SetConstraintName(ToSnakeCase(key.GetConstraintName()));
            }

            // Nombres de Índices
            foreach (var index in entity.GetIndexes())
            {
                index.SetDatabaseName(ToSnakeCase(index.GetDatabaseName()));
            }
        }

        base.OnModelCreating(modelBuilder);
    }

    private string ToSnakeCase(string? input)
    {
        if (string.IsNullOrEmpty(input)) return input ?? "";
        
        return System.Text.RegularExpressions.Regex.Replace(
            input,
            "([a-z0-9])([A-Z])",
            "$1_$2").ToLowerInvariant();
    }
}
