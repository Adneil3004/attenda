using Attenda.Domain.Common;

namespace Attenda.Domain.Aggregates.EventAggregate;

public class CheckIn : Entity
{
    public Guid GuestId { get; private set; }
    public DateTime CheckInTime { get; private set; }
    public string? ScannedBy { get; private set; }

    private CheckIn(Guid guestId, string? scannedBy) : base()
    {
        GuestId = guestId;
        CheckInTime = DateTime.UtcNow;
        ScannedBy = scannedBy;
    }

    public static CheckIn Create(Guid guestId, string? scannedBy = null)
        => new(guestId, scannedBy);
}
