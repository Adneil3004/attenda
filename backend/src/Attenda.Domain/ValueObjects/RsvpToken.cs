using Attenda.Domain.Common;

namespace Attenda.Domain.ValueObjects;

public class RsvpToken : ValueObject
{
    public Guid Value { get; }

    private RsvpToken(Guid value)
    {
        Value = value;
    }

    public static RsvpToken Create() => new(Guid.NewGuid());

    public static RsvpToken From(Guid value) => new(value);

    public static RsvpToken From(string value)
    {
        if (!Guid.TryParse(value, out var guid))
            throw new ArgumentException("Invalid RSVP token format.", nameof(value));
        
        return new(guid);
    }

    protected override IEnumerable<object?> GetEqualityComponents()
    {
        yield return Value;
    }

    public override string ToString() => Value.ToString();
}
