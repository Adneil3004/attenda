using Attenda.Domain.Common;
using Attenda.Domain.Enums;
using TaskStatus = Attenda.Domain.Enums.TaskStatus;

namespace Attenda.Domain.Aggregates.EventAggregate;

public class TaskItem : Entity
{
    public string Title { get; private set; }
    public string? Description { get; private set; }
    public TaskStatus Status { get; private set; }
    public TaskPriority Priority { get; private set; }
    public DateTime? DueDate { get; private set; }

    private TaskItem() : base() { Title = null!; } // Required by EF Core

    private TaskItem(string title, string? description, TaskPriority priority, DateTime? dueDate) : base()
    {
        Title = title;
        Description = description;
        Status = TaskStatus.Pending;
        Priority = priority;
        DueDate = dueDate;
    }

    public static TaskItem Create(string title, string? description = null, TaskPriority priority = TaskPriority.Medium, DateTime? dueDate = null)
        => new(title, description, priority, dueDate);

    public void UpdateStatus(TaskStatus status) => Status = status;
    
    public void UpdatePriority(TaskPriority priority) => Priority = priority;

    public void UpdateDetails(string title, string? description, DateTime? dueDate)
    {
        Title = title;
        Description = description;
        DueDate = dueDate;
    }
}
