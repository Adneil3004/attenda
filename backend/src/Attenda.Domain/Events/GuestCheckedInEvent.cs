using Attenda.Domain.Common;

namespace Attenda.Domain.Events;

public record GuestCheckedInEvent(Guid EventId, Guid GuestId, DateTime CheckInTime) : IDomainEvent
{
    public DateTime OccurredOn => DateTime.UtcNow;
}
