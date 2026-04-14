using Attenda.Application.Events.DTOs;
using Attenda.Domain.Interfaces;
using MediatR;

namespace Attenda.Application.Events.Queries.GetUserEvents;

public record GetUserEventsQuery(Guid UserId) : IRequest<List<EventListDto>>;

public class GetUserEventsQueryHandler : IRequestHandler<GetUserEventsQuery, List<EventListDto>>
{
    private readonly IEventRepository _eventRepository;

    public GetUserEventsQueryHandler(IEventRepository eventRepository)
    {
        _eventRepository = eventRepository;
    }

    public async Task<List<EventListDto>> Handle(GetUserEventsQuery request, CancellationToken cancellationToken)
    {
        var events = await _eventRepository.GetByOrganizerIdAsync(request.UserId, cancellationToken);
        
        return events
            .OrderByDescending(e => e.Date.StartDate)
            .Select(e => new EventListDto(
                e.Id,
                e.Name,
                e.EventType,
                e.Date.StartDate,
                e.VenueAddress ?? e.ReligiousAddress ?? "Sin ubicación",
                e.Guests.Count,
                e.Status.ToString(),
                e.CapacityTier,
                e.ImageUrl,
                e.IsBusiness))
            .ToList();
    }
}
