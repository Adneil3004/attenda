using Attenda.Application.Guests.DTOs;
using MediatR;

namespace Attenda.Application.Guests.Queries.GetGuests;

public record GetGuestsQuery(Guid EventId, Guid UserId) : IRequest<List<GuestDto>>;
