namespace Attenda.Application.Tasks.DTOs;

public record ChecklistItemDto(
    Guid Id,
    string Text,
    bool IsDone);
