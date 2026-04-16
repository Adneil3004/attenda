using Attenda.Domain.Aggregates.EventAggregate;
using Attenda.Domain.ValueObjects;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Attenda.Infrastructure.Persistence.Configurations;

public class GuestConfiguration : IEntityTypeConfiguration<Guest>
{
    public void Configure(EntityTypeBuilder<Guest> builder)
    {
        builder.HasKey(g => g.Id);

        builder.Property(g => g.FirstName).IsRequired().HasMaxLength(100);
        builder.Property(g => g.LastName).IsRequired().HasMaxLength(100);
        builder.Property(g => g.InvitationSent)
            .HasColumnName("invitation_sent")
            .HasDefaultValue(false);

        builder.Property(g => g.PhoneNumber)
            .HasConversion(
                v => v.Value,
                v => PhoneNumber.Create(v))
            .IsRequired();

        builder.Property(g => g.RsvpToken)
            .HasConversion(
                v => v.Value,
                v => RsvpToken.From(v))
            .IsRequired();

        builder.Property(g => g.RsvpStatus)
            .HasConversion<string>();

        // Índices de Rendimiento e Integridad
        builder.HasIndex(g => g.RsvpToken).IsUnique();
        builder.HasIndex(g => new { g.EventId, g.PhoneNumber }).IsUnique();

        builder.OwnsMany(g => g.DietaryRestrictions, a =>
        {
            a.ToTable("guest_dietary_restrictions");
            a.WithOwner().HasForeignKey("guest_id");
            a.Property(x => x.Name).HasColumnName("restriction_name");
        });

        builder.Property(g => g.PrivateNotes)
            .HasColumnName("private_notes");

        // Relación con GuestGroup (SetNull para evitar borrar invitados)
        builder.HasOne<GuestGroup>()
            .WithMany()
            .HasForeignKey(g => g.GuestGroupId)
            .OnDelete(DeleteBehavior.SetNull);

        // Relación con Table (SetNull al borrar mesa — el invitado queda sin mesa, no se elimina)
        builder.Property(g => g.TableId)
            .HasColumnName("table_id");

        builder.HasOne<Table>()
            .WithMany()
            .HasForeignKey(g => g.TableId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
