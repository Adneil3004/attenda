using Attenda.Domain.Common;
using Attenda.Domain.Enums;

namespace Attenda.Domain.Aggregates.EventAggregate;

public class Table : Entity
{
    public string Name { get; private set; }
    public int Capacity { get; private set; }
    public TablePriority Priority { get; private set; }
    public Guid EventId { get; private set; }

    private Table() : base(Guid.Empty) { Name = null!; } // Requerido por EF Core

    private Table(string name, int capacity, TablePriority priority) : base(Guid.Empty)
    {
        Name = name;
        Capacity = capacity;
        Priority = priority;
    }

    public static Table Create(string name, int capacity, TablePriority priority)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("El nombre de la mesa no puede estar vacío.", nameof(name));
        if (capacity <= 0)
            throw new ArgumentException("La capacidad debe ser mayor a cero.", nameof(capacity));

        return new Table(name, capacity, priority);
    }

    public void UpdateDetails(string name, int capacity, TablePriority priority)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("El nombre de la mesa no puede estar vacío.", nameof(name));
        if (capacity <= 0)
            throw new ArgumentException("La capacidad debe ser mayor a cero.", nameof(capacity));

        Name = name;
        Capacity = capacity;
        Priority = priority;
    }
}
