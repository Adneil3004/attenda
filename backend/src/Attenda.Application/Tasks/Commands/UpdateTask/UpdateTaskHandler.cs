using Attenda.Application.Tasks.DTOs;
using Attenda.Domain.Aggregates.EventAggregate;
using Attenda.Domain.Interfaces;
using Attenda.Domain.Enums;
using MediatR;

namespace Attenda.Application.Tasks.Commands.UpdateTask;

public class UpdateTaskHandler : IRequestHandler<UpdateTaskCommand, TaskItemDto>
{
    private readonly IEventRepository _eventRepository;
    private readonly IUnitOfWork _unitOfWork;

    public UpdateTaskHandler(IEventRepository eventRepository, IUnitOfWork unitOfWork)
    {
        _eventRepository = eventRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<TaskItemDto> Handle(UpdateTaskCommand request, CancellationToken cancellationToken)
    {
        var @event = await _eventRepository.GetByIdAsync(request.EventId, cancellationToken);

        if (@event == null)
        {
            throw new KeyNotFoundException($"Event {request.EventId} not found.");
        }

        if (@event.OrganizerId != request.UserId)
        {
            throw new UnauthorizedAccessException("You do not have permission to update tasks in this event.");
        }

        var dueDate = request.DueDate.HasValue 
            ? DateTime.SpecifyKind(request.DueDate.Value, DateTimeKind.Utc) 
            : (DateTime?)null;

        @event.UpdateTask(
            request.TaskId,
            request.Title ?? "Untitled Task",
            string.IsNullOrWhiteSpace(request.Description) ? null : request.Description,
            request.Priority ?? TaskPriority.Medium,
            dueDate);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        var taskItem = @event.TaskItems.First(t => t.Id == request.TaskId);

        return new TaskItemDto(
            taskItem.Id,
            taskItem.Title,
            taskItem.Description,
            taskItem.Status.ToString(),
            taskItem.Priority.ToString(),
            taskItem.DueDate,
            taskItem.CreatedAt);
    }
}