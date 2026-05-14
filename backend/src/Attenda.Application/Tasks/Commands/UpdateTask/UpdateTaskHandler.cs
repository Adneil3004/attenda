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

        var taskItem = @event.TaskItems.First(t => t.Id == request.TaskId);

        // Sincronizar checklist si se envió
        if (request.Checklist is not null)
        {
            SyncChecklist(taskItem, request.Checklist);
        }

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return new TaskItemDto(
            taskItem.Id,
            taskItem.Title,
            taskItem.Description,
            taskItem.Status.ToString(),
            taskItem.Priority.ToString(),
            taskItem.DueDate,
            taskItem.CreatedAt,
            taskItem.Checklist.Select(c => new ChecklistItemDto(c.Id, c.Text, c.IsDone)).ToList());
    }

    private static void SyncChecklist(TaskItem taskItem, List<ChecklistItemDto> incoming)
    {
        var existingIds = taskItem.Checklist.Select(c => c.Id).ToHashSet();
        var incomingIds = incoming.Where(c => c.Id != Guid.Empty).Select(c => c.Id).ToHashSet();

        // Eliminar los que ya no vienen
        var toRemove = existingIds.Except(incomingIds).ToList();
        foreach (var id in toRemove)
            taskItem.RemoveChecklistItem(id);

        foreach (var dto in incoming)
        {
            if (dto.Id == Guid.Empty)
            {
                // Nuevo item — sin Id asignado aún
                taskItem.AddChecklistItem(dto.Text);
            }
            else
            {
                // Existente — sincronizar estado IsDone
                taskItem.ToggleChecklistItem(dto.Id, dto.IsDone);
            }
        }
    }
}