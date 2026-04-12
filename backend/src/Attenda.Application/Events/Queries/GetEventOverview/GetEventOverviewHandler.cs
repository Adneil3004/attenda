using Attenda.Application.Events.DTOs;
using Attenda.Domain.Aggregates.EventAggregate;
using Attenda.Domain.Enums;
using Attenda.Domain.Interfaces;
using MediatR;

namespace Attenda.Application.Events.Queries.GetEventOverview;

public class GetEventOverviewHandler : IRequestHandler<GetEventOverviewQuery, EventOverviewDto>
{
    private readonly IEventRepository _eventRepository;

    public GetEventOverviewHandler(IEventRepository eventRepository)
    {
        _eventRepository = eventRepository;
    }

    public async Task<EventOverviewDto> Handle(GetEventOverviewQuery request, CancellationToken cancellationToken)
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
            throw new KeyNotFoundException($"Event not found for user {request.UserId}.");
        }

        // Security check
        if (@event.OrganizerId != request.UserId)
        {
            throw new UnauthorizedAccessException("You do not have permission to access this event.");
        }

        var totalGuests = @event.Guests.Count;
        var confirmedGuests = @event.Guests.Count(g => g.RsvpStatus == RsvpStatus.Confirmed);
        var pendingGuests = @event.Guests.Count(g => g.RsvpStatus == RsvpStatus.Pending);
        var declinedGuests = @event.Guests.Count(g => g.RsvpStatus == RsvpStatus.Declined);

        return new EventOverviewDto
        {
            Id = @event.Id,
            Name = @event.Name,
            StartDate = @event.Date.StartDate,
            Location = @event.VenueAddress,
            TotalGuests = totalGuests,
            ConfirmedGuests = confirmedGuests,
            PendingGuests = pendingGuests,
            DeclinedGuests = declinedGuests,
            ProgressPercentage = CalculateProgressPercentage(@event.CreatedAt, @event.Date.StartDate),
            ImageUrl = @event.ImageUrl
        };

    }

    private int CalculateProgressPercentage(DateTime createdAt, DateTime eventDate)
    {
        var now = DateTime.UtcNow;

        if (now >= eventDate) return 100;
        if (now <= createdAt) return 0;

        var totalDuration = eventDate - createdAt;
        var elapsedDuration = now - createdAt;

        if (totalDuration.TotalSeconds <= 0) return 100;

        var percentage = (int)((elapsedDuration.TotalSeconds / totalDuration.TotalSeconds) * 100);
        return Math.Clamp(percentage, 0, 100);
    }
}
