using Attenda.Domain.Common;
using Attenda.Domain.Enums;
using Attenda.Domain.ValueObjects;

namespace Attenda.Domain.Aggregates.EventAggregate;

public class Guest : Entity
{
    public string FirstName { get; private set; }
    public string LastName { get; private set; }
    public EmailAddress Email { get; private set; }
    public RsvpStatus RsvpStatus { get; private set; }
    public RsvpToken RsvpToken { get; private set; }
    public Guid? GuestGroupId { get; private set; }
    
    private readonly List<DietaryRestriction> _dietaryRestrictions = new();
    public IReadOnlyCollection<DietaryRestriction> DietaryRestrictions => _dietaryRestrictions.AsReadOnly();
    public bool PlusOne { get; private set; }
    public string? Notes { get; private set; }

    private Guest(string firstName, string lastName, EmailAddress email, Guid? guestGroupId = null, IEnumerable<DietaryRestriction>? dietaryRestrictions = null, bool plusOne = false, string? notes = null) : base()
    {
        FirstName = firstName;
        LastName = lastName;
        Email = email;
        GuestGroupId = guestGroupId;
        RsvpStatus = RsvpStatus.Pending;
        RsvpToken = RsvpToken.Create();
        if (dietaryRestrictions != null)
        {
            _dietaryRestrictions.AddRange(dietaryRestrictions);
        }
        PlusOne = plusOne;
        Notes = notes;
    }

    public static Guest Create(string firstName, string lastName, EmailAddress email, Guid? guestGroupId = null, IEnumerable<DietaryRestriction>? dietaryRestrictions = null, bool plusOne = false, string? notes = null)
        => new(firstName, lastName, email, guestGroupId, dietaryRestrictions, plusOne, notes);

    public void UpdateRsvpStatus(RsvpStatus status)
    {
        RsvpStatus = status;
    }

    public void MoveToGroup(Guid? groupId) => GuestGroupId = groupId;
}
