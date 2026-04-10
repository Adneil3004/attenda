using Attenda.Domain.Common;

namespace Attenda.Domain.ValueObjects;

public class EventDate : ValueObject
{
    public DateTime StartDate { get; }
    public DateTime? EndDate { get; }

    private EventDate(DateTime startDate, DateTime? endDate)
    {
        if (endDate.HasValue && endDate.Value < startDate)
            throw new ArgumentException("End date cannot be earlier than start date.");

        StartDate = startDate;
        EndDate = endDate;
    }

    public static EventDate Create(DateTime startDate, DateTime? endDate = null) 
        => new(startDate, endDate);

    protected override IEnumerable<object?> GetEqualityComponents()
    {
        yield return StartDate;
        yield return EndDate;
    }
}
