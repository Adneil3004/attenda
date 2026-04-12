using Attenda.Application.Tasks.DTOs;
using Attenda.Domain.Aggregates.EventAggregate;
using Attenda.Domain.Interfaces;
using MediatR;

namespace Attenda.Application.Tasks.Queries.GetTasks;

public class GetTasksHandler : IRequestHandler<GetTasksQuery, List<TaskItemDto>>
{
    private readonly IEventRepository _eventRepository;

    public GetTasksHandler(IEventRepository eventRepository)
    {
        _eventRepository = eventRepository;
    }

    public async Task<List<TaskItemDto>> Handle(GetTasksQuery request, CancellationToken cancellationToken)
    {
        var @event = await _eventRepository.GetByIdAsync(request.EventId, cancellationToken);

        if (@event == null)
        {
            throw new KeyNotFoundException($"Event {request.EventId} not found.");
        }

        if (@event.OrganizerId != request.UserId)
        {
            throw new UnauthorizedAccessException("You do not have permission to view tasks for this event.");
        }

        return @event.TaskItems.Select(t => new TaskItemDto(
            t.Id,
            t.Title,
            t.Description,
            t.Status.ToString(),
            t.Priority.ToString(),
            t.DueDate,
            t.CreatedAt)).ToList();
    }
}