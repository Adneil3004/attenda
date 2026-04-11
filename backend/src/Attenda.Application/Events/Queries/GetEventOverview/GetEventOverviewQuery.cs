using Attenda.Application.Events.DTOs;
using MediatR;

namespace Attenda.Application.Events.Queries.GetEventOverview;

public record GetEventOverviewQuery(Guid? EventId, Guid UserId) : IRequest<EventOverviewDto>;
