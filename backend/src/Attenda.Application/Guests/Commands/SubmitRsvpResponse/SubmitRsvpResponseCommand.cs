using Attenda.Domain.Enums;
using MediatR;

namespace Attenda.Application.Guests.Commands.SubmitRsvpResponse;

public record PlusOneRequest(string FirstName, string LastName, string? PhoneNumber);

public record SubmitRsvpResponseCommand(
    string Token,
    RsvpStatus Status,
    List<PlusOneRequest> PlusOnes
) : IRequest<bool>;
