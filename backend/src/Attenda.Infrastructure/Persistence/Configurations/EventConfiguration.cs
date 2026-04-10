using Attenda.Domain.Aggregates.EventAggregate;
using Attenda.Domain.ValueObjects;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Attenda.Infrastructure.Persistence.Configurations;

public class EventConfiguration : IEntityTypeConfiguration<Event>
{
    public void Configure(EntityTypeBuilder<Event> builder)
    {
        builder.HasKey(e => e.Id);

        builder.Property(e => e.Name)
            .IsRequired()
            .HasMaxLength(200);

        builder.OwnsOne(e => e.Date, date =>
        {
            date.Property(d => d.StartDate).HasColumnName("start_date");
            date.Property(d => d.EndDate).HasColumnName("end_date");
        });

        builder.Property(e => e.Status)
            .HasConversion<string>();

        builder.HasMany(e => e.Guests)
            .WithOne()
            .HasForeignKey("event_id")
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(e => e.GuestGroups)
            .WithOne()
            .HasForeignKey("event_id")
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(e => e.TaskItems)
            .WithOne()
            .HasForeignKey("event_id")
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(e => e.CheckIns)
            .WithOne()
            .HasForeignKey("event_id")
            .OnDelete(DeleteBehavior.Cascade);

        // Access private collections
        var navigation = builder.Metadata.FindNavigation(nameof(Event.Guests));
        navigation?.SetPropertyAccessMode(PropertyAccessMode.Field);
    }
}
