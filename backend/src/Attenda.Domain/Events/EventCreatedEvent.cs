using Attenda.Domain.Common;

namespace Attenda.Domain.Events;

public record EventCreatedEvent(Guid EventId, string Name, Guid OrganizerId) : IDomainEvent
{
    public DateTime OccurredOn => DateTime.UtcNow;
}
