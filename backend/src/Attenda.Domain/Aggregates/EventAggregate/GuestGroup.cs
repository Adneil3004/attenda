using Attenda.Domain.Common;

namespace Attenda.Domain.Aggregates.EventAggregate;

public class GuestGroup : Entity
{
    public string Name { get; private set; }

    private GuestGroup(string name) : base()
    {
        Name = name;
    }

    public static GuestGroup Create(string name) => new(name);

    public void UpdateName(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("Group name cannot be empty.");
        Name = name;
    }
}
