using Attenda.Application.Guests.DTOs;
using Attenda.Application.Common.Models;
using Attenda.Domain.Interfaces;
using MediatR;

namespace Attenda.Application.Guests.Queries.GetGuests;

public class GetGuestsHandler : IRequestHandler<GetGuestsQuery, PaginatedList<GuestDto>>
{
    private readonly IEventRepository _eventRepository;

    public GetGuestsHandler(IEventRepository eventRepository)
    {
        _eventRepository = eventRepository;
    }

    public async Task<PaginatedList<GuestDto>> Handle(GetGuestsQuery request, CancellationToken cancellationToken)
    {
        var (guests, totalCount) = await _eventRepository.GetGuestsPaginatedAsync(
            request.EventId, 
            request.PageNumber, 
            request.PageSize, 
            request.SearchTerm, 
            request.GroupId, 
            request.Status,
            cancellationToken);

        var @event = await _eventRepository.GetWithGuestsAndGroupsAsync(request.EventId, cancellationToken);
        var groupDict = @event?.GuestGroups.ToDictionary(g => g.Id, g => g.Name) ?? new Dictionary<Guid, string>();

        var dtos = guests.Select(g => new GuestDto(
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

        return new PaginatedList<GuestDto>(dtos, totalCount, request.PageNumber, request.PageSize);
    }
}
