using MediatR;

namespace Attenda.Application.Guests.Commands.CreateGuest;

public record CreateGuestCommand(
    Guid EventId,
    string FirstName,
    string LastName,
    string Email,
    string RsvpStatus,
    Guid? GuestGroupId,
    List<string> DietaryRestrictions,
    bool PlusOne,
    string? Notes,
    Guid UserId) : IRequest<Guid>;
