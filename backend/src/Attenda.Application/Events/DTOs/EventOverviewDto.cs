namespace Attenda.Application.Events.DTOs;

public class EventOverviewDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public string? Location { get; set; }
    public int TotalGuests { get; set; }
    public int ConfirmedGuests { get; set; }
    public int PendingGuests { get; set; }
    public int DeclinedGuests { get; set; }
    public int ProgressPercentage { get; set; }
    public string? ImageUrl { get; set; }
    public bool IsBusiness { get; set; }
}

