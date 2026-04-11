using MediatR;

namespace Attenda.Application.Guests.Commands.DeleteAllGuests;

public record DeleteAllGuestsCommand(Guid EventId, Guid UserId) : IRequest;
