using Attenda.Domain.Aggregates.EventAggregate;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Attenda.Infrastructure.Persistence.Configurations;

public class CheckInConfiguration : IEntityTypeConfiguration<CheckIn>
{
    public void Configure(EntityTypeBuilder<CheckIn> builder)
    {
        builder.HasKey(c => c.Id);

        builder.Property(c => c.GuestId)
            .IsRequired();

        builder.Property(c => c.CheckInTime)
            .IsRequired();

        builder.Property(c => c.ScannedBy)
            .HasMaxLength(200);

        // Relación con Guest (Cascade Delete)
        // Cuando un invitado es eliminado, sus check-ins correspondientes deben desaparecer
        builder.HasOne<Guest>()
            .WithMany()
            .HasForeignKey(c => c.GuestId)
            .OnDelete(DeleteBehavior.Cascade);

        // Relación con Event (Cascade Delete)
        builder.HasOne<Event>()
            .WithMany(e => e.CheckIns)
            .HasForeignKey("event_id")
            .OnDelete(DeleteBehavior.Cascade);
    }
}
