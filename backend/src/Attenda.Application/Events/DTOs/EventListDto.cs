namespace Attenda.Application.Events.DTOs;

public record EventListDto(
    Guid Id,
    string Name,
    string? EventType,
    DateTime Date,
    string? LocationName,
    int GuestCount,
    string Status,
    string CapacityTier,
    string? ImageUrl);
