using Attenda.Domain.Aggregates.EventAggregate;
using Attenda.Domain.Aggregates.UserAggregate;
using Attenda.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace Attenda.Infrastructure.Persistence;

public class AppDbContext : DbContext, IUnitOfWork
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Event> Events => Set<Event>();
    public DbSet<User> Users => Set<User>();
    public DbSet<PaymentMethod> PaymentMethods => Set<PaymentMethod>();
    public DbSet<Guest> Guests => Set<Guest>();
    public DbSet<GuestGroup> GuestGroups => Set<GuestGroup>();
    public DbSet<CheckIn> CheckIns => Set<CheckIn>();
    public DbSet<TaskItem> TaskItems => Set<TaskItem>();
    public DbSet<Table> Tables => Set<Table>();
    public DbSet<EventActivity> EventActivities => Set<EventActivity>();
    public DbSet<Attenda.Domain.Aggregates.PaymentPackage> PaymentPackages => Set<Attenda.Domain.Aggregates.PaymentPackage>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Ignore<Attenda.Domain.Common.Entity>();
        modelBuilder.Ignore<Attenda.Domain.Common.AggregateRoot>();

        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);

        // PostgreSQL requires all DateTime values to be UTC
        foreach (var entityType in modelBuilder.Model.GetEntityTypes())
        {
            foreach (var property in entityType.GetProperties())
            {
                if (property.ClrType == typeof(DateTime))
                {
                    property.SetValueConverter(new ValueConverter<DateTime, DateTime>(
                        v => v.Kind == DateTimeKind.Utc ? v : DateTime.SpecifyKind(v, DateTimeKind.Utc),
                        v => v.Kind == DateTimeKind.Utc ? v : DateTime.SpecifyKind(v, DateTimeKind.Utc)));
                }
                else if (property.ClrType == typeof(DateTime?))
                {
                    property.SetValueConverter(new ValueConverter<DateTime?, DateTime?>(
                        v => v.HasValue ? (v.Value.Kind == DateTimeKind.Utc ? v : DateTime.SpecifyKind(v.Value, DateTimeKind.Utc)) : v,
                        v => v.HasValue ? (v.Value.Kind == DateTimeKind.Utc ? v : DateTime.SpecifyKind(v.Value, DateTimeKind.Utc)) : v));
                }
            }
        }

        base.OnModelCreating(modelBuilder);
    }
}
