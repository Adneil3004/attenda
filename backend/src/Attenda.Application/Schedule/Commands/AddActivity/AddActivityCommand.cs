using Attenda.Application.Schedule.DTOs;
using Attenda.Domain.Enums;
using MediatR;

namespace Attenda.Application.Schedule.Commands.AddActivity;

public record AddActivityCommand(
    Guid EventId,
    string Title,
    string? Description,
    DateTime StartTime,
    DateTime EndTime,
    ActivityCategory Category,
    string? CustomCategory,
    Guid UserId) : IRequest<EventActivityDto>;
