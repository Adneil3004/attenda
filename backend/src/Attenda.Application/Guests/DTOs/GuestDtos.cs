namespace Attenda.Application.Guests.DTOs;

public record GuestDto(
    Guid Id,
    string FirstName,
    string LastName,
    string Email,
    string RsvpStatus,
    Guid? GuestGroupId,
    List<string> DietaryRestrictions);

public record GuestDetailsDto(
    Guid Id,
    string FullName,
    string Email,
    string RsvpStatus,
    string? GroupName,
    bool CheckedIn);
