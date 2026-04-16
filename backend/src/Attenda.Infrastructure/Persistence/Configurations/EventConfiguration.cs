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

        builder.Property(e => e.EventType)
            .HasColumnName("event_type");

        builder.Property(e => e.Celebrants)
            .HasColumnName("celebrants")
            .HasColumnType("text[]");

        builder.Property(e => e.OrganizerName)
            .HasColumnName("organizer_name");

        builder.Property(e => e.ReligiousAddress)
            .HasColumnName("religious_address");

        builder.Property(e => e.VenueAddress)
            .HasColumnName("venue_address");

        builder.Property(e => e.ImageUrl)
            .HasColumnName("image_url");

        builder.Property(e => e.CapacityTier)
            .HasColumnName("capacity_tier")
            .HasColumnType("text");

        builder.Property(e => e.GuestLimit)
            .HasColumnName("guest_limit");

        builder.OwnsOne(e => e.RsvpConfig, rsvp =>
        {
            rsvp.ToTable("event_rsvp_configs");
            rsvp.WithOwner().HasForeignKey("event_id");
            rsvp.Property(r => r.Headline).HasColumnName("headline");
            rsvp.Property(r => r.Message).HasColumnName("message");
            rsvp.Property(r => r.HeaderImageUrl).HasColumnName("header_image_url");
            rsvp.Property(r => r.RequireAttendanceTracking).HasColumnName("require_attendance_tracking");
            rsvp.Property(r => r.AllowDietaryRequirements).HasColumnName("allow_dietary_requirements");
            rsvp.Property(r => r.TypographyTheme).HasColumnName("typography_theme");
            rsvp.Property(r => r.ColorTheme).HasColumnName("color_theme");
        });


        builder.HasMany(e => e.Guests)
            .WithOne()
            .HasForeignKey("EventId")
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(e => e.GuestGroups)
            .WithOne()
            .HasForeignKey("EventId")
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(e => e.TaskItems)
            .WithOne()
            .HasForeignKey("EventId")
            .OnDelete(DeleteBehavior.Cascade);


        builder.HasMany(e => e.CheckIns)
            .WithOne()
            .HasForeignKey("event_id")
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(e => e.Tables)
            .WithOne()
            .HasForeignKey("EventId")
            .OnDelete(DeleteBehavior.Cascade);

        // Access private collections
        var navigation = builder.Metadata.FindNavigation(nameof(Event.Guests));
        navigation?.SetPropertyAccessMode(PropertyAccessMode.Field);

        var tablesNav = builder.Metadata.FindNavigation(nameof(Event.Tables));
        tablesNav?.SetPropertyAccessMode(PropertyAccessMode.Field);
    }
}
