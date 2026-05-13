using Attenda.Domain.Enums;
using MediatR;

namespace Attenda.Application.Schedule.Commands.UpdateActivity;

public record UpdateActivityCommand(
    Guid EventId,
    Guid ActivityId,
    string Title,
    string? Description,
    DateTime StartTime,
    DateTime EndTime,
    ActivityCategory Category,
    string? CustomCategory,
    Guid UserId) : IRequest<Unit>;
