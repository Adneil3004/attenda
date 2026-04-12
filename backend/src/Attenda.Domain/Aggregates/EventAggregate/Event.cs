using Attenda.Domain.Common;
using Attenda.Domain.Enums;
using Attenda.Domain.ValueObjects;

namespace Attenda.Domain.Aggregates.EventAggregate;

public class Event : AggregateRoot
{
    public string Name { get; private set; }
    public string? Description { get; private set; }
    public EventDate Date { get; private set; }
    public EventStatus Status { get; private set; }
    public Guid OrganizerId { get; private set; }

    public string? EventType { get; private set; }
    public string[]? Celebrants { get; private set; }
    public string? OrganizerName { get; private set; }
    public string? ReligiousAddress { get; private set; }
    public string? VenueAddress { get; private set; }
    public string? ImageUrl { get; private set; }
    public string CapacityTier { get; private set; } = "FREE";
    public int GuestLimit { get; private set; } = 20;
    public DateTime CreatedAt { get; private set; }

    private readonly List<Guest> _guests = new();
    public IReadOnlyCollection<Guest> Guests => _guests.AsReadOnly();

    private readonly List<GuestGroup> _guestGroups = new();
    public IReadOnlyCollection<GuestGroup> GuestGroups => _guestGroups.AsReadOnly();

    private readonly List<CheckIn> _checkIns = new();
    public IReadOnlyCollection<CheckIn> CheckIns => _checkIns.AsReadOnly();

    private readonly List<TaskItem> _taskItems = new();
    public IReadOnlyCollection<TaskItem> TaskItems => _taskItems.AsReadOnly();

    private Event() : base() { Name = null!; CapacityTier = null!; } // Required by EF Core

    private Event(string name, string? description, EventDate date, Guid organizerId, string? eventType = null, string[]? celebrants = null, string? organizerName = null, string? religiousAddress = null, string? venueAddress = null, string capacityTier = "FREE", int guestLimit = 20, string? imageUrl = null) : base()
    {
        Name = name;
        Description = description;
        Date = date;
        OrganizerId = organizerId;
        Status = EventStatus.Draft;
        EventType = eventType;
        Celebrants = celebrants;
        OrganizerName = organizerName;
        ReligiousAddress = religiousAddress;
        VenueAddress = venueAddress;
        CapacityTier = capacityTier;
        GuestLimit = guestLimit;
        ImageUrl = imageUrl;
        CreatedAt = DateTime.UtcNow;
    }

    public static Event Create(string name, string? description, EventDate date, Guid organizerId, string? eventType = null, string[]? celebrants = null, string? organizerName = null, string? religiousAddress = null, string? venueAddress = null, string capacityTier = "FREE", int guestLimit = 20, string? imageUrl = null)
    {
        var @event = new Event(name, description, date, organizerId, eventType, celebrants, organizerName, religiousAddress, venueAddress, capacityTier, guestLimit, imageUrl);
        // Add EventCreated domain event here if needed
        return @event;
    }

    public void UpdateDetails(
        string name, 
        string? description, 
        EventDate date, 
        string? eventType, 
        string[]? celebrants, 
        string? organizerName, 
        string? religiousAddress, 
        string? venueAddress, 
        string? imageUrl)
    {
        Name = name;
        Description = description;
        Date = date;
        EventType = eventType;
        Celebrants = celebrants;
        OrganizerName = organizerName;
        ReligiousAddress = religiousAddress;
        VenueAddress = venueAddress;
        ImageUrl = imageUrl;
    }


    public void SetStatus(EventStatus status) => Status = status;

    public Guest AddGuest(string firstName, string lastName, EmailAddress email, Guid? groupId = null, IEnumerable<DietaryRestriction>? dietaryRestrictions = null, bool plusOne = false, string? notes = null)
    {
        if (_guests.Count >= GuestLimit)
            throw new InvalidOperationException($"Guest limit of {GuestLimit} reached for this {CapacityTier} event.");

        if (_guests.Any(g => g.Email != null && g.Email.Value == email.Value))
            throw new InvalidOperationException($"Guest with email {email} already exists in this event.");

        var guest = Guest.Create(firstName, lastName, email, groupId, dietaryRestrictions, plusOne, notes);
        _guests.Add(guest);
        return guest;
    }

    public void AddGuestGroup(string name)
    {
        if (_guestGroups.Any(g => g.Name.Equals(name, StringComparison.OrdinalIgnoreCase)))
            throw new InvalidOperationException($"Group with name {name} already exists.");

        _guestGroups.Add(GuestGroup.Create(name));
    }

    public void RecordCheckIn(Guid guestId, string? scannedBy = null)
    {
        if (!_guests.Any(g => g.Id == guestId))
            throw new InvalidOperationException("Guest not found in this event.");

        if (_checkIns.Any(c => c.GuestId == guestId))
            throw new InvalidOperationException("Guest is already checked in.");

        _checkIns.Add(CheckIn.Create(guestId, scannedBy));
    }

    public void AddTask(string title, string? description = null, TaskPriority priority = TaskPriority.Medium, DateTime? dueDate = null)
    {
        _taskItems.Add(TaskItem.Create(title, description, priority, dueDate));
    }

    public void UpdateTask(Guid taskId, string title, string? description, TaskPriority priority, DateTime? dueDate)
    {
        var taskItem = _taskItems.FirstOrDefault(t => t.Id == taskId);
        if (taskItem == null)
        {
            throw new KeyNotFoundException($"Task {taskId} not found.");
        }

        taskItem.UpdateDetails(title, description, dueDate);
        taskItem.UpdatePriority(priority);
    }

    public void RemoveTask(Guid taskId)
    {
        var taskItem = _taskItems.FirstOrDefault(t => t.Id == taskId);
        if (taskItem == null)
        {
            throw new KeyNotFoundException($"Task {taskId} not found.");
        }

        _taskItems.Remove(taskItem);
    }

    public void RemoveGuest(Guid guestId)
    {
        var guest = _guests.FirstOrDefault(g => g.Id == guestId);
        if (guest != null)
        {
            _guests.Remove(guest);
            _checkIns.RemoveAll(c => c.GuestId == guestId);
        }
    }

    public void RemoveGuests(IEnumerable<Guid> guestIds)
    {
        foreach (var guestId in guestIds)
        {
            RemoveGuest(guestId);
        }
    }

    public void ClearGuests()
    {
        _guests.Clear();
        _checkIns.Clear();
    }
}
