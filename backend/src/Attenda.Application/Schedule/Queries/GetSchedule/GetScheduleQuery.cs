using Attenda.Application.Schedule.DTOs;
using MediatR;

namespace Attenda.Application.Schedule.Queries.GetSchedule;

public record GetScheduleQuery(Guid EventId) : IRequest<IEnumerable<EventActivityDto>>;
