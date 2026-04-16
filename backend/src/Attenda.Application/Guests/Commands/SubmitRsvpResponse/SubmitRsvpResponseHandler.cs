using Attenda.Domain.Aggregates.EventAggregate;
using Attenda.Domain.Interfaces;
using Attenda.Domain.ValueObjects;
using Attenda.Domain.Enums;
using MediatR;

namespace Attenda.Application.Guests.Commands.SubmitRsvpResponse;

public class SubmitRsvpResponseHandler : IRequestHandler<SubmitRsvpResponseCommand, bool>
{
    private readonly IEventRepository _eventRepository;
    private readonly IUnitOfWork _unitOfWork;

    public SubmitRsvpResponseHandler(IEventRepository eventRepository, IUnitOfWork unitOfWork)
    {
        _eventRepository = eventRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<bool> Handle(SubmitRsvpResponseCommand request, CancellationToken cancellationToken)
    {
        var guest = await _eventRepository.GetGuestByTokenAsync(request.Token, cancellationToken);
        if (guest == null) return false;

        var @event = await _eventRepository.GetByIdAsync(guest.EventId, cancellationToken);
        if (@event == null) return false;

        var status = request.Status;

        // 1. Update Main Guest Status & Log
        guest.UpdateRsvpStatus(status);
        guest.AddLogEntry("rsvp_submitted", $"Estado: {status}");

        // 2. Process Plus-Ones only if Confirmation
        if (status == RsvpStatus.Confirmed && request.PlusOnes != null && request.PlusOnes.Any())
        {
            var addedGuests = new List<Guest>();
            foreach (var p in request.PlusOnes)
            {
                // Create sub-guest. They use the same group as the main guest.
                // Plus-ones use placeholder phones if not provided to satisfy domain constraints
                var phoneValue = string.IsNullOrWhiteSpace(p.PhoneNumber) 
                    ? $"{guest.PhoneNumber.Value}-P{addedGuests.Count + 1}" 
                    : p.PhoneNumber;

                var plusOne = @event.AddGuest(
                    p.FirstName,
                    p.LastName, 
                    PhoneNumber.Create(phoneValue),
                    plusOnes: 0, 
                    groupId: guest.GuestGroupId,
                    notes: $"Acompañante de {guest.FirstName} {guest.LastName}"
                );
                
                addedGuests.Add(plusOne);
            }

            // Important: This reduces the counter and logs the names
            guest.RegisterPlusOnes(addedGuests);
        }

        _eventRepository.Update(@event);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return true;
    }
}
