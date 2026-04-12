using Attenda.Application.Events.DTOs;
using Attenda.Domain.Aggregates.EventAggregate;
using Attenda.Domain.Enums;
using Attenda.Domain.Interfaces;
using MediatR;

namespace Attenda.Application.Events.Queries.GetEventDashboard;

public class GetEventDashboardHandler : IRequestHandler<GetEventDashboardQuery, EventDashboardDto>
{
    private readonly IEventRepository _eventRepository;

    public GetEventDashboardHandler(IEventRepository eventRepository)
    {
        _eventRepository = eventRepository;
    }

    public async Task<EventDashboardDto> Handle(GetEventDashboardQuery request, CancellationToken cancellationToken)
    {
        try 
        {
            Event? @event;

            if (!request.EventId.HasValue || request.EventId == Guid.Empty)
            {
                var userEvents = await _eventRepository.GetByOrganizerIdAsync(request.UserId, cancellationToken);
                @event = userEvents
                    .Where(e => e.Date.StartDate >= DateTime.UtcNow)
                    .OrderBy(e => e.Date.StartDate)
                    .FirstOrDefault() ?? userEvents.OrderByDescending(e => e.Date.StartDate).FirstOrDefault();
            }
            else
            {
                @event = await _eventRepository.GetByIdAsync(request.EventId.Value, cancellationToken);
            }

            if (@event == null)
            {
                return null!;
            }

            // Security check
            if (@event.OrganizerId != request.UserId)
            {
                Console.WriteLine($"[DASHBOARD] ID Mismatch: Event {@event.OrganizerId} vs Request {request.UserId}");
                throw new UnauthorizedAccessException("You do not have permission to access this event.");
            }

            var today = DateTime.UtcNow.Date;

            return new EventDashboardDto
            {
                Id = @event.Id,
                Name = @event.Name,
                TotalGuests = @event.Guests.Count,
                TotalCheckedIn = @event.CheckIns.Count,
                CheckInsToday = @event.CheckIns.Count(c => c.CheckInTime.ToUniversalTime().Date == today),
                ConfirmedCount = @event.Guests.Count(g => g.RsvpStatus == RsvpStatus.Confirmed),
                PendingCount = @event.Guests.Count(g => g.RsvpStatus == RsvpStatus.Pending),
                DeclinedCount = @event.Guests.Count(g => g.RsvpStatus == RsvpStatus.Declined),
                EventDate = @event.Date.StartDate,
                LocationName = @event.VenueAddress ?? "No venue set",
                CapacityTier = @event.CapacityTier ?? "FREE",
                ImageUrl = @event.ImageUrl
            };

        }
        catch (Exception ex)
        {
            Console.WriteLine($"[DASHBOARD ERROR] {ex.Message}");
            if (ex.InnerException != null) Console.WriteLine($"[INNER] {ex.InnerException.Message}");
            throw; // Re-throw to maintain 500 but with logged details
        }
    }

}
