using Attenda.Domain.Aggregates.EventAggregate;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Attenda.Infrastructure.Persistence.Configurations;

public class EventActivityConfiguration : IEntityTypeConfiguration<EventActivity>
{
    public void Configure(EntityTypeBuilder<EventActivity> builder)
    {
        builder.HasKey(a => a.Id);
        builder.Property(a => a.Id).ValueGeneratedNever();

        builder.Property(a => a.Title)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(a => a.Description)
            .HasMaxLength(1000);

        builder.Property(a => a.Category)
            .HasConversion<string>();

        builder.Property(a => a.CustomCategory)
            .HasMaxLength(50);
            
        builder.Property(a => a.StartTime)
            .IsRequired();

        builder.Property(a => a.EndTime)
            .IsRequired();

        builder.Property(a => a.Order)
            .IsRequired();
            
        builder.Property(a => a.CreatedAt)
            .IsRequired();
    }
}
