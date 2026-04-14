namespace Attenda.Application.Events.DTOs;

public record EventDto(
    Guid Id,
    string Name,
    string? Description,
    DateTime StartDate,
    DateTime? EndDate,
    string Status,
    Guid OrganizerId,
    string? ImageUrl,
    bool IsBusiness);

public record EventSummaryDto(
    Guid Id,
    string Name,
    DateTime StartDate,
    int GuestCount,
    int ConfirmedCount,
    bool IsBusiness);
