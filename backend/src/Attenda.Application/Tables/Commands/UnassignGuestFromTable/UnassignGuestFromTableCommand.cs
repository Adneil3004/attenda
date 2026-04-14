using MediatR;

namespace Attenda.Application.Tables.Commands.UnassignGuestFromTable;

public record UnassignGuestFromTableCommand(
    Guid EventId,
    Guid GuestId,
    Guid UserId) : IRequest;
