using MediatR;
using Attenda.Domain.Aggregates.EventAggregate;
using Attenda.Domain.Interfaces;
using Attenda.Domain.ValueObjects;

namespace Attenda.Application.Events.Commands.CreateEvent;

public class CreateEventHandler : IRequestHandler<CreateEventCommand, Guid>
{
    private readonly IEventRepository _eventRepository;
    private readonly IUnitOfWork _unitOfWork;

    public CreateEventHandler(IEventRepository eventRepository, IUnitOfWork unitOfWork)
    {
        _eventRepository = eventRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Guid> Handle(CreateEventCommand request, CancellationToken cancellationToken)
    {
        var eventDate = EventDate.Create(request.StartDate, request.EndDate);
        var @event = Event.Create(request.Name, request.Description, eventDate, request.OrganizerId);

        _eventRepository.Add(@event);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return @event.Id;
    }
}
