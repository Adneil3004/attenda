using Attenda.Domain.Common;
using Attenda.Domain.Enums;

namespace Attenda.Domain.Events;

public record GuestRsvpConfirmedEvent(Guid EventId, Guid GuestId, RsvpStatus Status) : IDomainEvent
{
    public DateTime OccurredOn => DateTime.UtcNow;
}
