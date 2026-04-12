using Attenda.Domain.Aggregates.EventAggregate;
using Attenda.Domain.Interfaces;
using Attenda.Domain.ValueObjects;
using Attenda.Domain.Enums;
using MediatR;

namespace Attenda.Application.Guests.Commands.UpdateGuest;

public class UpdateGuestHandler : IRequestHandler<UpdateGuestCommand, Unit>
{
    private readonly IEventRepository _eventRepository;
    private readonly IUnitOfWork _unitOfWork;

    public UpdateGuestHandler(IEventRepository eventRepository, IUnitOfWork unitOfWork)
    {
        _eventRepository = eventRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Unit> Handle(UpdateGuestCommand request, CancellationToken cancellationToken)
    {
        var @event = await _eventRepository.GetByIdAsync(request.EventId, cancellationToken);

        if (@event == null)
        {
            throw new KeyNotFoundException($"Event {request.EventId} not found.");
        }

        if (@event.OrganizerId != request.UserId)
        {
            throw new UnauthorizedAccessException("You do not have permission to update guests for this event.");
        }

        var guest = @event.Guests.FirstOrDefault(g => g.Id == request.GuestId);
        if (guest == null)
        {
            throw new KeyNotFoundException($"Guest {request.GuestId} not found in event {request.EventId}.");
        }

        var dietaryRestrictions = request.DietaryRestrictions?
            .Select(dr => DietaryRestriction.Create(dr))
            .ToList();

        guest.UpdateDetails(
            request.FirstName,
            request.LastName,
            EmailAddress.Create(request.Email),
            request.PlusOne,
            request.Notes,
            dietaryRestrictions
        );

        if (Enum.TryParse<RsvpStatus>(request.RsvpStatus, out var status))
        {
            guest.UpdateRsvpStatus(status);
        }

        guest.MoveToGroup(request.GuestGroupId);

        _eventRepository.Update(@event);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}
