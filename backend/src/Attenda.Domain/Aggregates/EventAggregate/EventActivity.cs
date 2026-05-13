using Attenda.Domain.Common;
using Attenda.Domain.Enums;

namespace Attenda.Domain.Aggregates.EventAggregate;

public class EventActivity : Entity
{
    public string Title { get; private set; }
    public string? Description { get; private set; }
    public DateTime StartTime { get; private set; }
    public DateTime EndTime { get; private set; }
    public ActivityCategory Category { get; private set; }
    public string? CustomCategory { get; private set; }
    public int Order { get; private set; }
    public DateTime CreatedAt { get; private set; }

    private EventActivity() : base() { Title = null!; } // Required by EF Core

    private EventActivity(
        string title, 
        string? description, 
        DateTime startTime, 
        DateTime endTime, 
        ActivityCategory category, 
        string? customCategory,
        int order) : base()
    {
        if (endTime < startTime)
            throw new ArgumentException("La hora de fin no puede ser anterior a la de inicio.");

        Title = title;
        Description = description;
        StartTime = startTime;
        EndTime = endTime;
        Category = category;
        CustomCategory = customCategory;
        Order = order;
        CreatedAt = DateTime.UtcNow;
    }

    public static EventActivity Create(
        string title, 
        string? description, 
        DateTime startTime, 
        DateTime endTime, 
        ActivityCategory category, 
        string? customCategory = null,
        int order = 0)
        => new(title, description, startTime, endTime, category, customCategory, order);

    public void Update(
        string title, 
        string? description, 
        DateTime startTime, 
        DateTime endTime, 
        ActivityCategory category, 
        string? customCategory)
    {
        if (endTime < startTime)
            throw new ArgumentException("La hora de fin no puede ser anterior a la de inicio.");

        Title = title;
        Description = description;
        StartTime = startTime;
        EndTime = endTime;
        Category = category;
        CustomCategory = customCategory;
    }

    public void UpdateOrder(int order) => Order = order;
}
