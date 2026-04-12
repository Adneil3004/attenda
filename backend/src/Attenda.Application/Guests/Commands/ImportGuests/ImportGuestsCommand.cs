using Attenda.Application.Guests.DTOs;
using MediatR;

namespace Attenda.Application.Guests.Commands.ImportGuests;

public record ImportGuestsCommand(Guid EventId, List<GuestImportDto> Guests, Guid UserId) : IRequest<Unit>;
