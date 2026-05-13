using Attenda.Domain.Enums;

namespace Attenda.Application.Schedule.DTOs;

public record EventActivityDto(
    Guid Id,
    string Title,
    string? Description,
    DateTime StartTime,
    DateTime EndTime,
    ActivityCategory Category,
    string? CustomCategory,
    int Order);
