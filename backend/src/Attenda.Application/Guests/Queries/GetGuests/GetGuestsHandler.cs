using Attenda.Application.Guests.DTOs;
using Attenda.Domain.Aggregates.EventAggregate;
using Attenda.Domain.Interfaces;
using MediatR;

namespace Attenda.Application.Guests.Queries.GetGuests;

public class GetGuestsHandler : IRequestHandler<GetGuestsQuery, List<GuestDto>>
{
    private readonly IEventRepository _eventRepository;

    public GetGuestsHandler(IEventRepository eventRepository)
    {
        _eventRepository = eventRepository;
    }

    public async Task<List<GuestDto>> Handle(GetGuestsQuery request, CancellationToken cancellationToken)
    {
        var @event = await _eventRepository.GetByIdAsync(request.EventId, cancellationToken);

        if (@event == null)
        {
            throw new KeyNotFoundException($"Event {request.EventId} not found.");
        }

        if (@event.OrganizerId != request.UserId)
        {
            throw new UnauthorizedAccessException("You do not have permission to access guests for this event.");
        }

        return @event.Guests.Select(g => new GuestDto(
            g.Id,
            g.FirstName,
            g.LastName,
            g.PhoneNumber.Value,
            g.RsvpStatus.ToString(),
            g.GuestGroupId,
            @event.GuestGroups.FirstOrDefault(group => group.Id == g.GuestGroupId)?.Name,
            g.DietaryRestrictions.Select(dr => dr.Name).ToList(),
            g.Notes
        )).ToList();
    }
}
