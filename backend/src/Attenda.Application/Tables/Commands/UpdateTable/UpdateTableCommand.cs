using Attenda.Domain.Enums;
using MediatR;

namespace Attenda.Application.Tables.Commands.UpdateTable;

public record UpdateTableCommand(
    Guid EventId,
    Guid TableId,
    string Name,
    int Capacity,
    TablePriority Priority,
    Guid UserId) : IRequest;
