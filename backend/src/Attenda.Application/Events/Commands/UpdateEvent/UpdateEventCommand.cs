using Attenda.Domain.Interfaces;
using Attenda.Domain.ValueObjects;
using MediatR;

namespace Attenda.Application.Events.Commands.UpdateEvent;

public record UpdateEventCommand(
    Guid Id,
    string Name,
    string? Description,
    DateTime StartDate,
    DateTime? EndDate,
    string? EventType,
    string[]? Celebrants,
    string? OrganizerName,
    string? ReligiousAddress,
    string? VenueAddress,
    string? ImageUrl,
    bool IsBusiness) : IRequest<bool>;

public class UpdateEventCommandHandler : IRequestHandler<UpdateEventCommand, bool>
{
    private readonly IEventRepository _eventRepository;
    private readonly IUnitOfWork _unitOfWork;

    public UpdateEventCommandHandler(IEventRepository eventRepository, IUnitOfWork unitOfWork)
    {
        _eventRepository = eventRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<bool> Handle(UpdateEventCommand request, CancellationToken cancellationToken)
    {
        var @event = await _eventRepository.GetByIdAsync(request.Id, cancellationToken);

        if (@event == null)
            return false;

        @event.UpdateDetails(
            request.Name,
            request.Description,
            EventDate.Create(request.StartDate, request.EndDate),
            request.EventType,
            request.Celebrants,
            request.OrganizerName,
            request.ReligiousAddress,
            request.VenueAddress,
            request.ImageUrl,
            request.IsBusiness);

        _eventRepository.Update(@event);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return true;
    }
}
