using Attenda.Domain.Aggregates.EventAggregate;

namespace Attenda.Domain.Interfaces;

public interface IEventRepository
{
    Task<Event?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Event?> GetWithGuestsAndGroupsAsync(Guid id, CancellationToken cancellationToken = default);
    Task<IEnumerable<Event>> GetByOrganizerIdAsync(Guid organizerId, CancellationToken cancellationToken = default);
    void Add(Event @event);
    void Update(Event @event);
    void Delete(Event @event);
    Task<Guest?> GetGuestByTokenAsync(string token, CancellationToken cancellationToken = default);
    Task<int> CountActiveEventsByTierAsync(Guid organizerId, string tier, CancellationToken cancellationToken = default);
    Task<(List<Guest> Items, int TotalCount)> GetGuestsPaginatedAsync(Guid eventId, int pageNumber, int pageSize, string searchTerm = null, Guid? groupId = null, RsvpStatus? status = null, CancellationToken cancellationToken = default);
}
