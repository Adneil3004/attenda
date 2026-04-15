using MediatR;

namespace Attenda.Application.Events.Queries.GetRsvpConfig;

public record GetRsvpConfigQuery(Guid EventId) : IRequest<RsvpConfigDto>;