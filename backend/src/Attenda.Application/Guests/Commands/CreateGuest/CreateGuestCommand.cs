using MediatR;

namespace Attenda.Application.Guests.Commands.CreateGuest;

public record CreateGuestCommand(
    Guid EventId,
    string FirstName,
    string LastName,
    string PhoneNumber,
    int PlusOnes,
    string RsvpStatus,
    Guid? GuestGroupId,
    string? GroupName,
    List<string> DietaryRestrictions,
    string? Notes,
    Guid UserId) : IRequest<Guid>;
