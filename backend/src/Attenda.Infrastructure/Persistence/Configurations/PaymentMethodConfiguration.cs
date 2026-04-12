using Attenda.Domain.Aggregates.UserAggregate;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Attenda.Infrastructure.Persistence.Configurations;

public class PaymentMethodConfiguration : IEntityTypeConfiguration<PaymentMethod>
{
    public void Configure(EntityTypeBuilder<PaymentMethod> builder)
    {
        builder.HasKey(pm => pm.Id);

        builder.Property(pm => pm.ProviderToken)
            .IsRequired()
            .HasMaxLength(255);

        builder.Property(pm => pm.Last4)
            .IsRequired()
            .HasMaxLength(4)
            .IsFixedLength(); // Always exactly 4 chars

        builder.Property(pm => pm.Brand)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(pm => pm.IsDefault).IsRequired();
        builder.Property(pm => pm.CreatedAt).IsRequired();

        // Prevents two cards with the same provider token for the same user
        builder.HasIndex(pm => new { pm.UserId, pm.ProviderToken }).IsUnique();

        // A user can have at most one default card (partial unique index concept — enforced via domain logic here)
        builder.HasOne<User>()
            .WithMany(u => u.PaymentMethods)
            .HasForeignKey(pm => pm.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
