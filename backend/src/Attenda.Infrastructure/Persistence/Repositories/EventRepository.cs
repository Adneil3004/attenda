using Attenda.Domain.Aggregates.EventAggregate;
using Attenda.Domain.Interfaces;
using Attenda.Domain.Enums;
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
            .Include(e => e.Activities)
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
            .Include(e => e.Activities)
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

    public async Task<int> CountActiveEventsByTierAsync(Guid organizerId, string tier, CancellationToken cancellationToken = default)
    {
        return await _context.Events
            .CountAsync(e => e.OrganizerId == organizerId && 
                             e.CapacityTier.ToLower() == tier.ToLower() &&
                             (e.Status == EventStatus.Active || e.Status == EventStatus.Draft), 
                        cancellationToken);
    }

    public async Task<(List<Guest> Items, int TotalCount)> GetGuestsPaginatedAsync(Guid eventId, int pageNumber, int pageSize, string searchTerm = null, Guid? groupId = null, RsvpStatus? status = null, CancellationToken cancellationToken = default)
    {
        var query = _context.Guests
            .AsNoTracking()
            .Where(g => g.EventId == eventId);

        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            var search = searchTerm.ToLower();
            query = query.Where(g => g.FirstName.ToLower().Contains(search) || 
                                     g.LastName.ToLower().Contains(search) || 
                                     (g.PhoneNumber != null && g.PhoneNumber.Value.Contains(search)));
        }

        if (groupId.HasValue)
        {
            query = query.Where(g => g.GuestGroupId == groupId.Value);
        }

        if (status.HasValue)
        {
            query = query.Where(g => g.RsvpStatus == status.Value);
        }

        var totalCount = await query.CountAsync(cancellationToken);
        
        var items = await query
            .OrderBy(g => g.FirstName)
            .ThenBy(g => g.LastName)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return (items, totalCount);
    }
}
