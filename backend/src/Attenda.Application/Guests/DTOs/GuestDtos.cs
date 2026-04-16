namespace Attenda.Application.Guests.DTOs;

public record GuestDto(
    Guid Id,
    string FirstName,
    string LastName,
    string PhoneNumber,
    int PlusOnes,
    string RsvpStatus,
    Guid? GuestGroupId,
    string? GroupName,
    string? Notes,
    string? Token,
    bool InvitationSent);

public record GuestDetailsDto(
    Guid Id,
    string FullName,
    string PhoneNumber,
    int PlusOnes,
    string RsvpStatus,
    string? GroupName,
    bool CheckedIn);

public record GuestGroupDto(
    Guid Id,
    string Name);

public record GuestImportDto(
    string FirstName,
    string LastName,
    string PhoneNumber,
    int PlusOnes,
    string? GroupName,
    List<string>? DietaryRestrictions,
    string? Notes);

public record GuestRsvpDto(
    Guid Id,
    Guid EventId,
    string FirstName,
    string LastName,
    string? PhoneNumber,
    int PlusOnes,
    string RsvpStatus,
    bool AlreadyResponded,
    Guid? GuestGroupId,
    string? RsvpHeadline,
    string? RsvpMessage,
    string? EventName,
    string? EventDate,
    string? VenueName,
    string? ColorTheme,
    string? TypographyTheme,
    string? HeaderImageUrl);
