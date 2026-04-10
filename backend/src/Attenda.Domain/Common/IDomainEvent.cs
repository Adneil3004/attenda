using MediatR;

namespace Attenda.Domain.Common;

/// <summary>
/// Marker interface for domain events.
/// Extends MediatR INotification for dispatching through the mediator pipeline.
/// </summary>
public interface IDomainEvent : INotification
{
    DateTime OccurredOn { get; }
}
