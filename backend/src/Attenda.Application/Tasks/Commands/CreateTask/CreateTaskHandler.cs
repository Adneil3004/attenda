using Attenda.Application.Tasks.DTOs;
using Attenda.Domain.Aggregates.EventAggregate;
using Attenda.Domain.Interfaces;
using Attenda.Domain.Enums;
using MediatR;

namespace Attenda.Application.Tasks.Commands.CreateTask;

public class CreateTaskHandler : IRequestHandler<CreateTaskCommand, TaskItemDto>
{
    private readonly IEventRepository _eventRepository;
    private readonly IUnitOfWork _unitOfWork;

    public CreateTaskHandler(IEventRepository eventRepository, IUnitOfWork unitOfWork)
    {
        _eventRepository = eventRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<TaskItemDto> Handle(CreateTaskCommand request, CancellationToken cancellationToken)
    {
        var @event = await _eventRepository.GetByIdAsync(request.EventId, cancellationToken);

        if (@event == null)
        {
            throw new KeyNotFoundException($"Event {request.EventId} not found.");
        }

        if (@event.OrganizerId != request.UserId)
        {
            Console.WriteLine($"[CreateTaskHandler] Access Denied: User {request.UserId} tried to add task to event {@event.Id} owned by {@event.OrganizerId}");
            throw new UnauthorizedAccessException("You do not have permission to add tasks to this event.");
        }

        var dueDate = request.DueDate.HasValue 
            ? DateTime.SpecifyKind(request.DueDate.Value, DateTimeKind.Utc) 
            : (DateTime?)null;

        @event.AddTask(
            request.Title,
            string.IsNullOrWhiteSpace(request.Description) ? null : request.Description,
            request.Priority,
            dueDate);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        // Get the last added task (the one we just created)
        var taskItem = @event.TaskItems.Last();

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