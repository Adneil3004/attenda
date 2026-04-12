using Attenda.Application.Guests.DTOs;
using Attenda.Domain.Interfaces;
using MediatR;

namespace Attenda.Application.Guests.Queries.GetGuestGroups;

public class GetGuestGroupsHandler : IRequestHandler<GetGuestGroupsQuery, List<GuestGroupDto>>
{
    private readonly IEventRepository _eventRepository;

    public GetGuestGroupsHandler(IEventRepository eventRepository)
    {
        _eventRepository = eventRepository;
    }

    public async Task<List<GuestGroupDto>> Handle(GetGuestGroupsQuery request, CancellationToken cancellationToken)
    {
        var @event = await _eventRepository.GetByIdAsync(request.EventId, cancellationToken);

        if (@event == null)
        {
            throw new KeyNotFoundException($"Event {request.EventId} not found.");
        }

        if (@event.OrganizerId != request.UserId)
        {
            throw new UnauthorizedAccessException("You do not have permission to access groups for this event.");
        }

        return @event.GuestGroups.Select(g => new GuestGroupDto(
            g.Id,
            g.Name
        )).ToList();
    }
}
