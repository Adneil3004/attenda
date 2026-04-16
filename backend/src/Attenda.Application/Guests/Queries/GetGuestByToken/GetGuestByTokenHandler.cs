using Attenda.Application.Guests.DTOs;
using Attenda.Domain.Enums;
using Attenda.Domain.Interfaces;
using MediatR;

namespace Attenda.Application.Guests.Queries.GetGuestByToken;

public class GetGuestByTokenHandler : IRequestHandler<GetGuestByTokenQuery, GuestRsvpDto?>
{
    private readonly IEventRepository _eventRepository;

    public GetGuestByTokenHandler(IEventRepository eventRepository)
    {
        _eventRepository = eventRepository;
    }

    public async Task<GuestRsvpDto?> Handle(GetGuestByTokenQuery request, CancellationToken cancellationToken)
    {
        var guest = await _eventRepository.GetGuestByTokenAsync(request.Token, cancellationToken);
        if (guest == null) return null;

        var @event = await _eventRepository.GetByIdAsync(guest.EventId, cancellationToken);
        if (@event == null) return null;

        return new GuestRsvpDto(
            Id: guest.Id,
            EventId: @event.Id,
            FirstName: guest.FirstName,
            LastName: guest.LastName,
            PhoneNumber: guest.PhoneNumber?.Value,
            PlusOnes: guest.PlusOnes,
            RsvpStatus: guest.RsvpStatus.ToString(),
            AlreadyResponded: guest.RsvpStatus != RsvpStatus.Pending,
            GuestGroupId: guest.GuestGroupId,
            RsvpHeadline: @event.RsvpConfig?.Headline,
            RsvpMessage: @event.RsvpConfig?.Message,
            EventName: @event.Name,
            EventDate: @event.Date.StartDate.ToString("yyyy-MM-ddTHH:mm:ssZ"),
            VenueName: @event.VenueAddress,
            ColorTheme: @event.RsvpConfig?.ColorTheme,
            TypographyTheme: @event.RsvpConfig?.TypographyTheme,
            HeaderImageUrl: @event.RsvpConfig?.HeaderImageUrl
        );
    }
}
