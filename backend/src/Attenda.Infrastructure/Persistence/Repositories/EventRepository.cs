using Attenda.Domain.Aggregates.EventAggregate;
using Attenda.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Attenda.Infrastructure.Persistence.Repositories;

public class EventRepository : IEventRepository
{
    private readonly AppDbContext _context;

    public EventRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Event?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Events
            .Include(e => e.Guests)
            .Include(e => e.GuestGroups)
            .Include(e => e.TaskItems)
            .Include(e => e.CheckIns)
            .FirstOrDefaultAsync(e => e.Id == id, cancellationToken);
    }

    public async Task<IEnumerable<Event>> GetByOrganizerIdAsync(Guid organizerId, CancellationToken cancellationToken = default)
    {
        return await _context.Events
            .Where(e => e.OrganizerId == organizerId)
            .OrderByDescending(e => e.Date.StartDate)
            .ToListAsync(cancellationToken);
    }

    public void Add(Event @event) => _context.Events.Add(@event);

    public void Update(Event @event) => _context.Events.Update(@event);

    public void Delete(Event @event) => _context.Events.Remove(@event);
}
