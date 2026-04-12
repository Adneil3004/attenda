using MediatR;

namespace Attenda.Application.Tasks.Commands.DeleteTask;

public record DeleteTaskCommand(
    Guid TaskId,
    Guid EventId,
    Guid UserId) : IRequest<bool>;