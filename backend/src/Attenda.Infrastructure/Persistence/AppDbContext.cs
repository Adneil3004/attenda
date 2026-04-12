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
    public DbSet<PaymentMethod> PaymentMethods => Set<PaymentMethod>();
    public DbSet<Guest> Guests => Set<Guest>();
    public DbSet<GuestGroup> GuestGroups => Set<GuestGroup>();
    public DbSet<CheckIn> CheckIns => Set<CheckIn>();
    public DbSet<TaskItem> TaskItems => Set<TaskItem>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Ignore<Attenda.Domain.Common.Entity>();
        modelBuilder.Ignore<Attenda.Domain.Common.AggregateRoot>();

        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);

        modelBuilder.Entity<TaskItem>(t =>
        {
            t.ToTable("task_items");
            t.HasKey(x => x.Id);
            t.Property(x => x.Id).ValueGeneratedOnAdd();
            
            t.Property(x => x.Priority)
                .HasConversion<string>();
                
            t.Property(x => x.Status)
                .HasConversion<string>();
        });

        base.OnModelCreating(modelBuilder);
    }
}
