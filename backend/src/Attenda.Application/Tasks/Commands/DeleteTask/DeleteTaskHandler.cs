using Attenda.Domain.Aggregates.EventAggregate;
using Attenda.Domain.Interfaces;
using MediatR;

namespace Attenda.Application.Tasks.Commands.DeleteTask;

public class DeleteTaskHandler : IRequestHandler<DeleteTaskCommand, bool>
{
    private readonly IEventRepository _eventRepository;
    private readonly IUnitOfWork _unitOfWork;

    public DeleteTaskHandler(IEventRepository eventRepository, IUnitOfWork unitOfWork)
    {
        _eventRepository = eventRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<bool> Handle(DeleteTaskCommand request, CancellationToken cancellationToken)
    {
        var @event = await _eventRepository.GetByIdAsync(request.EventId, cancellationToken);

        if (@event == null)
        {
            throw new KeyNotFoundException($"Event {request.EventId} not found.");
        }

        if (@event.OrganizerId != request.UserId)
        {
            throw new UnauthorizedAccessException("You do not have permission to delete tasks from this event.");
        }

        @event.RemoveTask(request.TaskId);

        _eventRepository.Update(@event);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return true;
    }
}