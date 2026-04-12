using Attenda.Application.Tasks.DTOs;
using Attenda.Domain.Enums;
using MediatR;

namespace Attenda.Application.Tasks.Commands.CreateTask;

public record CreateTaskCommand(
    Guid EventId,
    string Title,
    string? Description,
    TaskPriority Priority,
    DateTime? DueDate,
    Guid UserId) : IRequest<TaskItemDto>;