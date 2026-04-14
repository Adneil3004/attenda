using MediatR;
using Attenda.Application.Events.DTOs;

namespace Attenda.Application.Events.Commands.CreateEvent;

public record CreateEventCommand(
    string Name,
    string? Description,
    DateTime StartDate,
    DateTime? EndDate,
    Guid OrganizerId,
    string? EventType = null,
    string[]? Celebrants = null,
    string? OrganizerName = null,
    string? ReligiousAddress = null,
    string? VenueAddress = null,
    string CapacityTier = "FREE",
    int GuestLimit = 20,
    // Payment method — optional. Assumes the token was already obtained from Stripe on the frontend.
    string? CardToken = null,
    string? CardLast4 = null,
    string? CardBrand = null,
    bool IsBusiness = false) : IRequest<Guid>;
