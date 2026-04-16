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
            .Include(e => e.Tables)
            .Include(e => e.RsvpConfig)
            .FirstOrDefaultAsync(e => e.Id == id, cancellationToken);
    }

    public async Task<Event?> GetWithGuestsAndGroupsAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Events
            .AsNoTracking()
            .Include(e => e.Guests)
            .Include(e => e.GuestGroups)
            .FirstOrDefaultAsync(e => e.Id == id, cancellationToken);
    }

    public async Task<IEnumerable<Event>> GetByOrganizerIdAsync(Guid organizerId, CancellationToken cancellationToken = default)
    {
        return await _context.Events
            .Include(e => e.Guests)
            .Include(e => e.GuestGroups)
            .Include(e => e.TaskItems)
            .Include(e => e.CheckIns)
            .Include(e => e.Tables)
            .Include(e => e.RsvpConfig)
            .Where(e => e.OrganizerId == organizerId)
            .OrderByDescending(e => e.Date.StartDate)
            .ToListAsync(cancellationToken);
    }

    public void Add(Event @event) => _context.Events.Add(@event);

    public void Update(Event @event) => _context.Events.Update(@event);

    public void Delete(Event @event) => _context.Events.Remove(@event);

    public async Task<Guest?> GetGuestByTokenAsync(string token, CancellationToken cancellationToken = default)
    {
        if (!Guid.TryParse(token, out var tokenGuid))
            return null;
            
        // Use ToListAsync to avoid translation issues with RsvpToken.Value
        var guests = await _context.Set<Guest>().ToListAsync(cancellationToken);
        return guests.FirstOrDefault(g => g.RsvpToken.Value == tokenGuid);
    }
}
