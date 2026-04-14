using Attenda.Domain.Common;
using Attenda.Domain.Enums;
using Attenda.Domain.ValueObjects;

namespace Attenda.Domain.Aggregates.EventAggregate;

public class Guest : Entity
{
    public string FirstName { get; private set; }
    public string LastName { get; private set; }
    public PhoneNumber PhoneNumber { get; private set; }
    public RsvpStatus RsvpStatus { get; private set; }
    public RsvpToken RsvpToken { get; private set; }
    public Guid? GuestGroupId { get; private set; }
    public Guid? TableId { get; private set; }
    
    private readonly List<DietaryRestriction> _dietaryRestrictions = new();
    public IReadOnlyCollection<DietaryRestriction> DietaryRestrictions => _dietaryRestrictions.AsReadOnly();
    public string? Notes { get; private set; }

    private Guest() : base() { FirstName = null!; LastName = null!; PhoneNumber = null!; RsvpToken = null!; } // Required by EF Core

    private Guest(string firstName, string lastName, PhoneNumber phoneNumber, Guid? guestGroupId = null, IEnumerable<DietaryRestriction>? dietaryRestrictions = null, string? notes = null) : base()
    {
        FirstName = firstName;
        LastName = lastName;
        PhoneNumber = phoneNumber;
        GuestGroupId = guestGroupId;
        RsvpStatus = RsvpStatus.Pending;
        RsvpToken = RsvpToken.Create();
        if (dietaryRestrictions != null)
        {
            _dietaryRestrictions.AddRange(dietaryRestrictions);
        }
        Notes = notes;
    }

    public static Guest Create(string firstName, string lastName, PhoneNumber phoneNumber, Guid? guestGroupId = null, IEnumerable<DietaryRestriction>? dietaryRestrictions = null, string? notes = null)
        => new(firstName, lastName, phoneNumber, guestGroupId, dietaryRestrictions, notes);

    public void UpdateRsvpStatus(RsvpStatus status)
    {
        RsvpStatus = status;

        // Regla de Negocio: Si el invitado declina, liberar su asiento automáticamente.
        if (status == RsvpStatus.Declined)
            RemoveFromTable();
    }

    public void AssignToTable(Guid tableId) => TableId = tableId;
    public void RemoveFromTable() => TableId = null;

    public void MoveToGroup(Guid? groupId) => GuestGroupId = groupId;

    public void UpdateDetails(string firstName, string lastName, PhoneNumber phoneNumber, string? notes, IEnumerable<DietaryRestriction>? dietaryRestrictions)
    {
        FirstName = firstName;
        LastName = lastName;
        PhoneNumber = phoneNumber;
        Notes = notes;
        
        _dietaryRestrictions.Clear();
        if (dietaryRestrictions != null)
        {
            _dietaryRestrictions.AddRange(dietaryRestrictions);
        }
    }
}

