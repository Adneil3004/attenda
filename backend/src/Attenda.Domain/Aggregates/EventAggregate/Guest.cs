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

    private Guest(string firstName, string lastName, EmailAddress email, Guid? guestGroupId = null) : base()
    {
        FirstName = firstName;
        LastName = lastName;
        Email = email;
        GuestGroupId = guestGroupId;
        RsvpStatus = RsvpStatus.Pending;
        RsvpToken = RsvpToken.Create();
    }

    public static Guest Create(string firstName, string lastName, EmailAddress email, Guid? guestGroupId = null)
        => new(firstName, lastName, email, guestGroupId);

    public void UpdateRsvpStatus(RsvpStatus status)
    {
        RsvpStatus = status;
    }

    public void AddDietaryRestriction(DietaryRestriction restriction)
    {
        if (!_dietaryRestrictions.Contains(restriction))
            _dietaryRestrictions.Add(restriction);
    }

    public void ClearDietaryRestrictions() => _dietaryRestrictions.Clear();

    public void MoveToGroup(Guid? groupId) => GuestGroupId = groupId;
}
