using Attenda.Domain.Enums;

namespace Attenda.Application.Tasks.DTOs;

public record TaskItemDto(
    Guid Id,
    string Title,
    string? Description,
    string Status,
    string Priority,
    DateTime? DueDate,
    DateTime CreatedAt);