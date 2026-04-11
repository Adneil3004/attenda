using Attenda.Domain.Interfaces;
using MediatR;

namespace Attenda.Application.Guests.Commands.DeleteGuests;

public class DeleteGuestsHandler : IRequestHandler<DeleteGuestsCommand>
{
    private readonly IEventRepository _eventRepository;
    private readonly IUnitOfWork _unitOfWork;

    public DeleteGuestsHandler(IEventRepository eventRepository, IUnitOfWork unitOfWork)
    {
        _eventRepository = eventRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task Handle(DeleteGuestsCommand request, CancellationToken cancellationToken)
    {
        var @event = await _eventRepository.GetByIdAsync(request.EventId, cancellationToken);

        if (@event == null)
        {
            throw new KeyNotFoundException($"Event with ID {request.EventId} not found.");
        }

        if (@event.OrganizerId != request.UserId)
        {
            throw new UnauthorizedAccessException("You do not have permission to delete guests from this event.");
        }

        @event.RemoveGuests(request.GuestIds);

        _eventRepository.Update(@event);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }
}
