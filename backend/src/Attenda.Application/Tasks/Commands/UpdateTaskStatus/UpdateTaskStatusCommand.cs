using Attenda.Application.Tasks.DTOs;
using Attenda.Domain.Enums;
using MediatR;
using TaskStatus = Attenda.Domain.Enums.TaskStatus;

namespace Attenda.Application.Tasks.Commands.UpdateTaskStatus;

public record UpdateTaskStatusCommand(
    Guid TaskId,
    Guid EventId,
    TaskStatus Status,
    Guid UserId) : IRequest<TaskItemDto>;