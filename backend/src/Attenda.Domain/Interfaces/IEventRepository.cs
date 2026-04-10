using Attenda.Domain.Aggregates.EventAggregate;

namespace Attenda.Domain.Interfaces;

public interface IEventRepository
{
    Task<Event?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<IEnumerable<Event>> GetByOrganizerIdAsync(Guid organizerId, CancellationToken cancellationToken = default);
    void Add(Event @event);
    void Update(Event @event);
    void Delete(Event @event);
}
