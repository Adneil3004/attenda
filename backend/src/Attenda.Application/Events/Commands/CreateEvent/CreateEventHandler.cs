using MediatR;
using Attenda.Domain.Aggregates.EventAggregate;
using Attenda.Domain.Interfaces;
using Attenda.Domain.ValueObjects;

namespace Attenda.Application.Events.Commands.CreateEvent;

public class CreateEventHandler : IRequestHandler<CreateEventCommand, Guid>
{
    private readonly IEventRepository _eventRepository;
    private readonly IUserRepository _userRepository;
    private readonly IUnitOfWork _unitOfWork;

    public CreateEventHandler(
        IEventRepository eventRepository,
        IUserRepository userRepository,
        IUnitOfWork unitOfWork)
    {
        _eventRepository = eventRepository;
        _userRepository = userRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Guid> Handle(CreateEventCommand request, CancellationToken cancellationToken)
    {
        // 1. Register payment method on the organizer if card data was provided
        if (request.CardToken is not null && request.CardLast4 is not null && request.CardBrand is not null)
        {
            var organizer = await _userRepository.GetByIdAsync(request.OrganizerId, cancellationToken);
            
            if (organizer != null)
            {
                organizer.AddPaymentMethod(request.CardToken, request.CardLast4, request.CardBrand);
                _userRepository.Update(organizer);
            }
            else
            {
                // In a production app, we might want to create the user record here if missing,
                // but for now we just log it and proceed so the event creation doesn't fail.
                Console.WriteLine($"[WARNING] Organizer with id '{request.OrganizerId}' not found in public.users. Payment method not saved.");
            }

        }

        // 2. Create the event
        var eventDate = EventDate.Create(request.StartDate, request.EndDate);
        var @event = Event.Create(
            request.Name, 
            request.Description, 
            eventDate, 
            request.OrganizerId,
            request.EventType,
            request.Celebrants,
            request.OrganizerName,
            request.ReligiousAddress,
            request.VenueAddress,
            request.CapacityTier,
            request.GuestLimit,
            null, // imageUrl is handled separately in Controller for now
            request.IsBusiness);

        Console.WriteLine($"[CREATE EVENT] Name: {@event.Name}, Venue: {@event.VenueAddress}, Tier: {@event.CapacityTier}, Date: {@event.Date.StartDate}");
        _eventRepository.Add(@event);

        // 3. Persist both changes atomically
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return @event.Id;
    }
}
