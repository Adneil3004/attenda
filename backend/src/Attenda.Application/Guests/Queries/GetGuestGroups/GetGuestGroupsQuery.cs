using Attenda.Application.Guests.DTOs;
using MediatR;

namespace Attenda.Application.Guests.Queries.GetGuestGroups;

public record GetGuestGroupsQuery(Guid EventId, Guid UserId) : IRequest<List<GuestGroupDto>>;
