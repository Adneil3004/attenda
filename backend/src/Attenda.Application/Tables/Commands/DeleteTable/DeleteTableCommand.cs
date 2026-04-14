using MediatR;

namespace Attenda.Application.Tables.Commands.DeleteTable;

public record DeleteTableCommand(
    Guid EventId,
    Guid TableId,
    Guid UserId) : IRequest;
