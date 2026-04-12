using Attenda.Application.Events.DTOs;
using MediatR;

namespace Attenda.Application.Events.Queries.GetEventDashboard;

public record GetEventDashboardQuery(Guid? EventId, Guid UserId) : IRequest<EventDashboardDto>;
