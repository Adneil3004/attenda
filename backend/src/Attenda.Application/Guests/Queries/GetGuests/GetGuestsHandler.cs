using Attenda.Application.Guests.DTOs;
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
        var @event = await _eventRepository.GetWithGuestsAndGroupsAsync(request.EventId, cancellationToken);
        if (@event == null) return new List<GuestDto>();

        var groupDict = @event.GuestGroups.ToDictionary(g => g.Id, g => g.Name);

        return @event.Guests.Select(g => new GuestDto(
            g.Id,
            g.FirstName,
            g.LastName,
            g.PhoneNumber?.Value ?? string.Empty,
            g.PlusOnes,
            g.RsvpStatus.ToString(),
            g.GuestGroupId,
            g.GuestGroupId.HasValue && groupDict.TryGetValue(g.GuestGroupId.Value, out var name) ? name : null,
            g.Notes,
            g.RsvpToken?.Value.ToString(),
            g.InvitationSent
        )).ToList();
    }
}
