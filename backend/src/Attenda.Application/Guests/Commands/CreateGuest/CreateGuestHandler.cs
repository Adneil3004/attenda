using Attenda.Domain.Aggregates.EventAggregate;
using Attenda.Domain.Interfaces;
using Attenda.Domain.ValueObjects;
using Attenda.Domain.Enums;
using MediatR;

namespace Attenda.Application.Guests.Commands.CreateGuest;

public class CreateGuestHandler : IRequestHandler<CreateGuestCommand, Guid>
{
    private readonly IEventRepository _eventRepository;
    private readonly IUnitOfWork _unitOfWork;

    public CreateGuestHandler(IEventRepository eventRepository, IUnitOfWork unitOfWork)
    {
        _eventRepository = eventRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Guid> Handle(CreateGuestCommand request, CancellationToken cancellationToken)
    {
        var @event = await _eventRepository.GetByIdAsync(request.EventId, cancellationToken);

        if (@event == null)
        {
            throw new KeyNotFoundException($"Event {request.EventId} not found.");
        }

        if (@event.OrganizerId != request.UserId)
        {
            throw new UnauthorizedAccessException("You do not have permission to add guests to this event.");
        }

        var dietaryRestrictions = request.DietaryRestrictions?
            .Select(dr => DietaryRestriction.Create(dr))
            .ToList();

        var guest = @event.AddGuest(
            request.FirstName,
            request.LastName,
            EmailAddress.Create(request.Email),
            request.GuestGroupId,
            dietaryRestrictions,
            request.PlusOne,
            request.Notes
        );

        // Map status if provided
        if (Enum.TryParse<RsvpStatus>(request.RsvpStatus, out var status))
        {
            guest.UpdateRsvpStatus(status);
        }

        _eventRepository.Update(@event);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return guest.Id;
    }
}
