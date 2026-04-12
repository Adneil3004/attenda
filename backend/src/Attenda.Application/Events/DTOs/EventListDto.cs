namespace Attenda.Application.Events.DTOs;

public record EventListDto(
    Guid Id,
    string Name,
    string? Type,
    DateTime Date,
    string? Location,
    int GuestCount,
    string Status,
    string Tier,
    string? ImageUrl);
