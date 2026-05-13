using MediatR;

namespace Attenda.Application.Schedule.Commands.RemoveActivity;

public record RemoveActivityCommand(
    Guid EventId,
    Guid ActivityId,
    Guid UserId) : IRequest<Unit>;
