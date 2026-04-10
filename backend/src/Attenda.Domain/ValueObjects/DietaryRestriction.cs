using Attenda.Domain.Common;

namespace Attenda.Domain.ValueObjects;

public class DietaryRestriction : ValueObject
{
    public string Name { get; }

    private DietaryRestriction(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("Dietary restriction name cannot be empty.");
            
        Name = name.Trim();
    }

    public static DietaryRestriction Create(string name) => new(name);

    protected override IEnumerable<object?> GetEqualityComponents()
    {
        yield return Name;
    }

    public override string ToString() => Name;
}
