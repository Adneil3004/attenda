using MediatR;

namespace Attenda.Application.Guests.Commands.DeleteGuests;

public record DeleteGuestsCommand(Guid EventId, List<Guid> GuestIds, Guid UserId) : IRequest;
