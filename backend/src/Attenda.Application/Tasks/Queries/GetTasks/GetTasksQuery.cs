using Attenda.Application.Tasks.DTOs;
using Attenda.Domain.Enums;
using MediatR;

namespace Attenda.Application.Tasks.Queries.GetTasks;

public record GetTasksQuery(Guid EventId, Guid UserId) : IRequest<List<TaskItemDto>>;