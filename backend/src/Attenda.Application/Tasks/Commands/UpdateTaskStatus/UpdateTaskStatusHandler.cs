using Attenda.Application.Tasks.DTOs;
using Attenda.Domain.Aggregates.EventAggregate;
using Attenda.Domain.Interfaces;
using Attenda.Domain.Enums;
using MediatR;
using TaskStatus = Attenda.Domain.Enums.TaskStatus;

namespace Attenda.Application.Tasks.Commands.UpdateTaskStatus;

public class UpdateTaskStatusHandler : IRequestHandler<UpdateTaskStatusCommand, TaskItemDto>
{
    private readonly IEventRepository _eventRepository;
    private readonly IUnitOfWork _unitOfWork;

    public UpdateTaskStatusHandler(IEventRepository eventRepository, IUnitOfWork unitOfWork)
    {
        _eventRepository = eventRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<TaskItemDto> Handle(UpdateTaskStatusCommand request, CancellationToken cancellationToken)
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

        var taskItem = @event.TaskItems.FirstOrDefault(t => t.Id == request.TaskId);
        if (taskItem == null)
        {
            throw new KeyNotFoundException($"Task {request.TaskId} not found.");
        }

        taskItem.UpdateStatus(request.Status);

        _eventRepository.Update(@event);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

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