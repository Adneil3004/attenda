namespace Attenda.Application.Events.DTOs;

public class EventDashboardDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int TotalGuests { get; set; }
    public int TotalCheckedIn { get; set; }
    public int CheckInsToday { get; set; }
    public int ConfirmedCount { get; set; }
    public int PendingCount { get; set; }
    public int DeclinedCount { get; set; }
    public DateTime EventDate { get; set; }
    public string LocationName { get; set; } = string.Empty;
    public string CapacityTier { get; set; } = string.Empty;
    public string? ImageUrl { get; set; }
}

