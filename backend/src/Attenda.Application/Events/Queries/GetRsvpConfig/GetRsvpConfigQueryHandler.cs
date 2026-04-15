using Attenda.Domain.Aggregates.EventAggregate;
using Attenda.Domain.Interfaces;
using MediatR;

namespace Attenda.Application.Events.Queries.GetRsvpConfig;

public class GetRsvpConfigQueryHandler : IRequestHandler<GetRsvpConfigQuery, RsvpConfigDto>
{
    private readonly IEventRepository _eventRepository;

    public GetRsvpConfigQueryHandler(IEventRepository eventRepository)
    {
        _eventRepository = eventRepository;
    }

    public async Task<RsvpConfigDto> Handle(GetRsvpConfigQuery request, CancellationToken cancellationToken)
    {
        var @event = await _eventRepository.GetByIdAsync(request.EventId, cancellationToken);

        if (@event == null)
        {
            throw new KeyNotFoundException($"Event with ID {request.EventId} not found");
        }

        var rsvpConfig = @event.RsvpConfig;

        return new RsvpConfigDto
        {
            EventId = @event.Id,
            EventName = @event.Name,
            EventDate = @event.Date.StartDate,
            VenueName = @event.VenueAddress ?? "Venue details coming soon",
            RsvpConfig = new RsvpConfigDetailsDto
            {
                Headline = rsvpConfig?.Headline ?? "You're Invited!",
                Message = rsvpConfig?.Message ?? "We'd love to have you join us.",
                HeaderImageUrl = rsvpConfig?.HeaderImageUrl,
                RequireAttendanceTracking = rsvpConfig?.RequireAttendanceTracking ?? true,
                AllowDietaryRequirements = rsvpConfig?.AllowDietaryRequirements ?? false,
                TypographyTheme = rsvpConfig?.TypographyTheme ?? "Serif",
                ColorTheme = rsvpConfig?.ColorTheme ?? "Midnight"
            }
        };
    }
}