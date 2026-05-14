using Attenda.Domain.Common;

namespace Attenda.Domain.Aggregates.EventAggregate;

public class ChecklistItem : Entity
{
    public string Text { get; private set; }
    public bool IsDone { get; private set; }
    public DateTime CreatedAt { get; private set; }

    private ChecklistItem() : base() { Text = null!; } // Required by EF Core

    private ChecklistItem(string text) : base()
    {
        Text = text;
        IsDone = false;
        CreatedAt = DateTime.UtcNow;
    }

    public static ChecklistItem Create(string text)
    {
        if (string.IsNullOrWhiteSpace(text))
            throw new ArgumentException("Checklist item text cannot be empty.", nameof(text));

        return new ChecklistItem(text);
    }

    public void Toggle(bool isDone) => IsDone = isDone;
    public void UpdateText(string text)
    {
        if (string.IsNullOrWhiteSpace(text))
            throw new ArgumentException("Checklist item text cannot be empty.", nameof(text));
        Text = text;
    }
}
