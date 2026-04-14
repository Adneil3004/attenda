namespace Attenda.Application.Guests.DTOs;

public record GuestDto(
    Guid Id,
    string FirstName,
    string LastName,
    string PhoneNumber,
    string RsvpStatus,
    Guid? GuestGroupId,
    string? GroupName,
    List<string> DietaryRestrictions,
    string? Notes);

public record GuestDetailsDto(
    Guid Id,
    string FullName,
    string PhoneNumber,
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
    string? GroupName,
    List<string>? DietaryRestrictions,
    string? Notes);

