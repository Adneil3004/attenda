namespace Attenda.Application.Events.Queries.GetRsvpConfig;

public class RsvpConfigDto
{
    public Guid EventId { get; set; }
    public string EventName { get; set; } = string.Empty;
    public DateTime EventDate { get; set; }
    public string VenueName { get; set; } = string.Empty;
    public RsvpConfigDetailsDto RsvpConfig { get; set; } = new();
    public bool IsConfigured { get; set; }
}

public class RsvpConfigDetailsDto
{
    public string Headline { get; set; } = "You're Invited!";
    public string Message { get; set; } = "We'd love to have you join us.";
    public string? HeaderImageUrl { get; set; }
    public bool RequireAttendanceTracking { get; set; } = true;
    public bool AllowDietaryRequirements { get; set; }
    public string TypographyTheme { get; set; } = "Serif";
    public string ColorTheme { get; set; } = "Midnight";
}