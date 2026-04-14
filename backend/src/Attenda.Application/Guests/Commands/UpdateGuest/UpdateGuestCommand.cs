using MediatR;

namespace Attenda.Application.Guests.Commands.UpdateGuest;

public record UpdateGuestCommand(
    Guid EventId,
    Guid GuestId,
    string FirstName,
    string LastName,
    string PhoneNumber,
    string RsvpStatus,
    Guid? GuestGroupId,
    string? GroupName,
    List<string> DietaryRestrictions,
    string? Notes,
    Guid UserId) : IRequest<Unit>;
