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
    public bool IsBusiness { get; private set; }
    public string CapacityTier { get; private set; } = "FREE";
    public int GuestLimit { get; private set; } = 20;
    public int TotalPlusOnes => _guests.Sum(g => g.PlusOnes);
    public int TotalGuests => _guests.Count + TotalPlusOnes;
    public bool HasReachedLimit => TotalGuests >= GuestLimit;
    public DateTime CreatedAt { get; private set; }
    
    public RsvpConfiguration? RsvpConfig { get; private set; }

    private readonly List<Guest> _guests = new();
    public IReadOnlyCollection<Guest> Guests => _guests.AsReadOnly();

    private readonly List<GuestGroup> _guestGroups = new();
    public IReadOnlyCollection<GuestGroup> GuestGroups => _guestGroups.AsReadOnly();

    private readonly List<CheckIn> _checkIns = new();
    public IReadOnlyCollection<CheckIn> CheckIns => _checkIns.AsReadOnly();

    private readonly List<TaskItem> _taskItems = new();
    public IReadOnlyCollection<TaskItem> TaskItems => _taskItems.AsReadOnly();

    private readonly List<Table> _tables = new();
    public IReadOnlyCollection<Table> Tables => _tables.AsReadOnly();

    private Event() : base() { Name = null!; CapacityTier = null!; } // Required by EF Core

    private Event(string name, string? description, EventDate date, Guid organizerId, string? eventType = null, string[]? celebrants = null, string? organizerName = null, string? religiousAddress = null, string? venueAddress = null, string capacityTier = "FREE", int guestLimit = 20, string? imageUrl = null, bool isBusiness = false) : base()
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
        IsBusiness = isBusiness;
        ImageUrl = imageUrl;
        CreatedAt = DateTime.UtcNow;
    }

    public static Event Create(string name, string? description, EventDate date, Guid organizerId, string? eventType = null, string[]? celebrants = null, string? organizerName = null, string? religiousAddress = null, string? venueAddress = null, string capacityTier = "FREE", int guestLimit = 20, string? imageUrl = null, bool isBusiness = false)
    {
        // 1. Regla de negocio: No se pueden crear eventos en el pasado.
        if (date.StartDate.Date < DateTime.UtcNow.Date)
            throw new InvalidOperationException("No se puede crear un evento con una fecha de inicio en el pasado.");

        // 2. Regla de negocio: Validar límite de invitados según el Tier si es uno conocido.
        var maxAllowed = GetMaxGuestsForTier(capacityTier);
        if (guestLimit > maxAllowed)
            throw new InvalidOperationException($"El límite de invitados ({guestLimit}) excede el máximo permitido para el plan {capacityTier} ({maxAllowed}).");

        var @event = new Event(name, description, date, organizerId, eventType, celebrants, organizerName, religiousAddress, venueAddress, capacityTier, guestLimit, imageUrl, isBusiness);
        // Add EventCreated domain event here if needed
        return @event;
    }

    private static int GetMaxGuestsForTier(string tier) => tier.ToLower() switch
    {
        "free" => 40,
        "standard" => 150,
        "premium" => 250,
        "elite" => 500,
        "planner" => 9999,
        _ => 20 // Default legacy limit if unknown
    };

    private void EnsureEventIsModifiable()
    {
        if (Status == EventStatus.Completed || Status == EventStatus.Cancelled)
            throw new InvalidOperationException($"No se puede modificar el evento porque ya está en estado {Status}.");
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
        string? imageUrl,
        bool isBusiness)
    {
        EnsureEventIsModifiable();

        if (date.StartDate.Date < Date.StartDate.Date && date.StartDate.Date < DateTime.UtcNow.Date)
            throw new InvalidOperationException("No se puede mover un evento a una fecha pasada.");

        Name = name;
        Description = description;
        Date = date;
        EventType = eventType;
        Celebrants = celebrants;
        OrganizerName = organizerName;
        ReligiousAddress = religiousAddress;
        VenueAddress = venueAddress;
        ImageUrl = imageUrl;
        IsBusiness = isBusiness;
    }


    public void SetStatus(EventStatus status) => Status = status;

    public void UpdateRsvpConfiguration(RsvpConfiguration config)
    {
        EnsureEventIsModifiable();
        RsvpConfig = config;
    }

    public Guest AddGuest(string firstName, string lastName, PhoneNumber phoneNumber, int plusOnes = 0, Guid? groupId = null, IEnumerable<DietaryRestriction>? dietaryRestrictions = null, string? notes = null)
    {
        EnsureEventIsModifiable();
        var projectedTotal = _guests.Count + TotalPlusOnes + 1 + plusOnes;
        if (projectedTotal > GuestLimit)
            throw new InvalidOperationException($"Cannot add guest. This would exceed the limit of {GuestLimit} guests (current: {TotalGuests}, with plus-ones: {plusOnes}).");

        if (_guests.Any(g => g.PhoneNumber != null && g.PhoneNumber.Value == phoneNumber.Value))
            throw new InvalidOperationException($"Guest with phone number {phoneNumber} already exists in this event.");

        var guest = Guest.Create(firstName, lastName, phoneNumber, plusOnes, groupId, dietaryRestrictions, notes);
        _guests.Add(guest);
        return guest;
    }

    public void AddGuestGroup(string name)
    {
        EnsureEventIsModifiable();
        if (_guestGroups.Any(g => g.Name.Equals(name, StringComparison.OrdinalIgnoreCase)))
            throw new InvalidOperationException($"Group with name {name} already exists.");

        _guestGroups.Add(GuestGroup.Create(name));
    }

    public void RecordCheckIn(Guid guestId, string? scannedBy = null)
    {
        EnsureEventIsModifiable();
        if (!_guests.Any(g => g.Id == guestId))
            throw new InvalidOperationException("Guest not found in this event.");

        if (_checkIns.Any(c => c.GuestId == guestId))
            throw new InvalidOperationException("Guest is already checked in.");

        _checkIns.Add(CheckIn.Create(guestId, scannedBy));
    }

    public void AddTask(string title, string? description = null, TaskPriority priority = TaskPriority.Medium, DateTime? dueDate = null)
    {
        EnsureEventIsModifiable();
        _taskItems.Add(TaskItem.Create(title, description, priority, dueDate));
    }

    public void UpdateTask(Guid taskId, string title, string? description, TaskPriority priority, DateTime? dueDate)
    {
        EnsureEventIsModifiable();
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
        EnsureEventIsModifiable();
        var taskItem = _taskItems.FirstOrDefault(t => t.Id == taskId);
        if (taskItem == null)
        {
            throw new KeyNotFoundException($"Task {taskId} not found.");
        }

        _taskItems.Remove(taskItem);
    }

    public void RemoveGuest(Guid guestId)
    {
        EnsureEventIsModifiable();
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
        EnsureEventIsModifiable();
        _guests.Clear();
        _checkIns.Clear();
    }

    // ─── Table Management ────────────────────────────────────────────────────

    public Table AddTable(string name, int capacity, TablePriority priority)
    {
        EnsureEventIsModifiable();
        var table = Table.Create(name, capacity, priority);
        _tables.Add(table);
        return table;
    }

    public void UpdateTable(Guid tableId, string name, int capacity, TablePriority priority)
    {
        EnsureEventIsModifiable();
        var table = _tables.FirstOrDefault(t => t.Id == tableId)
            ?? throw new KeyNotFoundException($"Mesa {tableId} no encontrada.");

        // Si la nueva capacidad es menor que los invitados ya asignados, rechazar.
        var occupants = _guests.Count(g => g.TableId == tableId);
        if (capacity < occupants)
            throw new InvalidOperationException(
                $"No se puede reducir la capacidad a {capacity}. La mesa ya tiene {occupants} invitados asignados.");

        table.UpdateDetails(name, capacity, priority);
    }

    public void RemoveTable(Guid tableId)
    {
        EnsureEventIsModifiable();
        var table = _tables.FirstOrDefault(t => t.Id == tableId)
            ?? throw new KeyNotFoundException($"Mesa {tableId} no encontrada.");

        // Liberar todos los invitados asignados a esta mesa (no se eliminan del evento).
        foreach (var guest in _guests.Where(g => g.TableId == tableId))
            guest.RemoveFromTable();

        _tables.Remove(table);
    }

    public void AssignGuestToTable(Guid guestId, Guid tableId)
    {
        EnsureEventIsModifiable();
        var guest = _guests.FirstOrDefault(g => g.Id == guestId)
            ?? throw new KeyNotFoundException($"Invitado {guestId} no encontrado.");

        var table = _tables.FirstOrDefault(t => t.Id == tableId)
            ?? throw new KeyNotFoundException($"Mesa {tableId} no encontrada.");

        // Hard limit: verificar capacidad antes de asignar.
        var occupants = _guests.Count(g => g.TableId == tableId);
        if (occupants >= table.Capacity)
            throw new InvalidOperationException(
                $"La mesa '{table.Name}' está llena ({table.Capacity}/{table.Capacity}).");

        // Si ya tenía mesa, quitarlo de la anterior.
        guest.RemoveFromTable();
        guest.AssignToTable(tableId);
    }

    public void UnassignGuestFromTable(Guid guestId)
    {
        EnsureEventIsModifiable();
        var guest = _guests.FirstOrDefault(g => g.Id == guestId)
            ?? throw new KeyNotFoundException($"Invitado {guestId} no encontrado.");

        guest.RemoveFromTable();
    }
}
