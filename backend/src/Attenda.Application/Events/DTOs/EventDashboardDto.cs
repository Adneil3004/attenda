using Attenda.Application.Tasks.DTOs;

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
    public string Status { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? EventType { get; set; }
    public List<string> Celebrants { get; set; } = new();
    public string? OrganizerName { get; set; }
    public string? ReligiousAddress { get; set; }
    public DateTime EventDate { get; set; }
    public DateTime? EndDate { get; set; }
    public bool IsBusiness { get; set; }
    public string LocationName { get; set; } = string.Empty;
    public string CapacityTier { get; set; } = string.Empty;
    public int GuestLimit { get; set; }
    public string? ImageUrl { get; set; }
    public int TotalTables { get; set; }
    public int TotalSeatingCapacity { get; set; }
    public int SeatedGuestsCount { get; set; }
    public int AvailableTablesCount { get; set; }
    public int FullTablesCount { get; set; }
    public List<TaskItemDto> Tasks { get; set; } = new();
}

