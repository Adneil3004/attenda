namespace Attenda.Application.Guests.DTOs;

public record GuestDto(
    Guid Id,
    string FirstName,
    string LastName,
    string Email,
    string RsvpStatus,
    Guid? GuestGroupId,
    string? GroupName,
    List<string> DietaryRestrictions,
    bool PlusOne,
    string? Notes);

public record GuestDetailsDto(
    Guid Id,
    string FullName,
    string Email,
    string RsvpStatus,
    string? GroupName,
    bool CheckedIn);

public record GuestGroupDto(
    Guid Id,
    string Name);

public record GuestImportDto(
    string FirstName,
    string LastName,
    string Email,
    string? GroupName,
    List<string>? DietaryRestrictions,
    bool PlusOne,
    string? Notes);
