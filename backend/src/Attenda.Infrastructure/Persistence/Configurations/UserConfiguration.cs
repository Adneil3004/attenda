using Attenda.Domain.Aggregates.UserAggregate;
using Attenda.Domain.ValueObjects;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Attenda.Infrastructure.Persistence.Configurations;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.HasKey(u => u.Id);

        builder.Property(u => u.FullName).IsRequired().HasMaxLength(200);

        builder.Property(u => u.Email)
            .HasConversion(
                v => v.Value,
                v => EmailAddress.Create(v))
            .IsRequired();

        builder.HasIndex(u => u.Email).IsUnique();
        
        builder.Property(u => u.PasswordHash).IsRequired();
    }
}
