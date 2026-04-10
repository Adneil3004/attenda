using MediatR;
using Attenda.Application.Events.DTOs;

namespace Attenda.Application.Events.Commands.CreateEvent;

public record CreateEventCommand(
    string Name,
    string? Description,
    DateTime StartDate,
    DateTime? EndDate,
    Guid OrganizerId) : IRequest<Guid>;
