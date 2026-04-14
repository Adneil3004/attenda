namespace Attenda.Application.Tables.DTOs;

public record TableDto(
    Guid Id,
    string Name,
    int Capacity,
    string Priority,
    int OccupantsCount,
    List<TableGuestDto> Guests);

public record TableGuestDto(
    Guid Id,
    string FirstName,
    string LastName,
    string RsvpStatus);
