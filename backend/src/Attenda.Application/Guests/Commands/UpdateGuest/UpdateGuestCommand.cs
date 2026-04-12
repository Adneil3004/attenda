using MediatR;

namespace Attenda.Application.Guests.Commands.UpdateGuest;

public record UpdateGuestCommand(
    Guid EventId,
    Guid GuestId,
    string FirstName,
    string LastName,
    string Email,
    string RsvpStatus,
    Guid? GuestGroupId,
    List<string> DietaryRestrictions,
    bool PlusOne,
    string? Notes,
    Guid UserId) : IRequest<Unit>;
