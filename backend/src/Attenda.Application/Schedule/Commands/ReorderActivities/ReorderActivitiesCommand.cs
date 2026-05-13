using MediatR;

namespace Attenda.Application.Schedule.Commands.ReorderActivities;

public record ReorderActivitiesCommand(
    Guid EventId,
    IEnumerable<Guid> ActivityIds,
    Guid UserId) : IRequest<Unit>;
