using Attenda.Domain.Common;

namespace Attenda.Domain.ValueObjects;

public class RsvpConfiguration : ValueObject
{
    public string? Headline { get; private set; }
    public string? Message { get; private set; }
    public string? HeaderImageUrl { get; private set; }
    public bool RequireAttendanceTracking { get; private set; }
    public bool AllowDietaryRequirements { get; private set; }
    public string? TypographyTheme { get; private set; }
    public string? ColorTheme { get; private set; }

    private RsvpConfiguration() { }

    private RsvpConfiguration(string? headline, string? message, string? headerImageUrl, bool requireAttendanceTracking, bool allowDietaryRequirements, string? typographyTheme, string? colorTheme)
    {
        Headline = headline;
        Message = message;
        HeaderImageUrl = headerImageUrl;
        RequireAttendanceTracking = requireAttendanceTracking;
        AllowDietaryRequirements = allowDietaryRequirements;
        TypographyTheme = typographyTheme;
        ColorTheme = colorTheme;
    }

    public static RsvpConfiguration Create(
        string? headline, 
        string? message, 
        string? headerImageUrl, 
        bool requireAttendanceTracking, 
        bool allowDietaryRequirements, 
        string? typographyTheme, 
        string? colorTheme)
    {
        return new RsvpConfiguration(
            headline, 
            message, 
            headerImageUrl, 
            requireAttendanceTracking, 
            allowDietaryRequirements, 
            typographyTheme, 
            colorTheme);
    }

    protected override IEnumerable<object?> GetEqualityComponents()
    {
        yield return Headline;
        yield return Message;
        yield return HeaderImageUrl;
        yield return RequireAttendanceTracking;
        yield return AllowDietaryRequirements;
        yield return TypographyTheme;
        yield return ColorTheme;
    }
}
