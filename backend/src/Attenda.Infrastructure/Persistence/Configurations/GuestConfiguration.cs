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

        builder.Property(g => g.Email)
            .HasConversion(
                v => v.Value,
                v => EmailAddress.Create(v))
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
        builder.HasIndex("event_id", "Email").IsUnique();

        builder.OwnsMany(g => g.DietaryRestrictions, a =>
        {
            a.ToTable("guest_dietary_restrictions");
            a.WithOwner().HasForeignKey("guest_id");
            a.Property(x => x.Name).HasColumnName("restriction_name");
        });

        // Relación con GuestGroup (SetNull para evitar borrar invitados)
        builder.HasOne<GuestGroup>()
            .WithMany()
            .HasForeignKey(g => g.GuestGroupId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
