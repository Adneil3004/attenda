using MediatR;

namespace Attenda.Application.Tables.Commands.AssignGuestToTable;

public record AssignGuestToTableCommand(
    Guid EventId,
    Guid TableId,
    Guid GuestId,
    Guid UserId) : IRequest;
