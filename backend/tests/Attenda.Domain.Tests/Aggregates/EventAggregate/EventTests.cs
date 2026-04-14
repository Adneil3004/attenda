using Attenda.Domain.Aggregates.EventAggregate;
using Attenda.Domain.ValueObjects;
using Xunit;

namespace Attenda.Domain.Tests.Aggregates.EventAggregate;

public class EventTests
{
    [Fact]
    public void RemoveGuest_ShouldAlsoRemoveAssociatedCheckIn()
    {
        // Arrange
        var organizerId = Guid.NewGuid();
        var @event = Event.Create(
            "Test Event",
            "Description",
            EventDate.Create(DateTime.UtcNow.AddDays(1)),
            organizerId);

        var guest = @event.AddGuest("John", "Doe", PhoneNumber.Create("+1234567890"));
        @event.RecordCheckIn(guest.Id, "Scanner1");

        Assert.Single(@event.Guests);
        Assert.Single(@event.CheckIns);

        // Act
        @event.RemoveGuest(guest.Id);

        // Assert
        Assert.Empty(@event.Guests);
        Assert.Empty(@event.CheckIns);
    }

    [Fact]
    public void ClearGuests_ShouldAlsoClearAllCheckIns()
    {
        // Arrange
        var organizerId = Guid.NewGuid();
        var @event = Event.Create(
            "Test Event",
            "Description",
            EventDate.Create(DateTime.UtcNow.AddDays(1)),
            organizerId);

        var guest1 = @event.AddGuest("John", "Doe", PhoneNumber.Create("+1234567890"));
        var guest2 = @event.AddGuest("Jane", "Doe", PhoneNumber.Create("+0987654321"));
        
        @event.RecordCheckIn(guest1.Id, "Scanner1");
        @event.RecordCheckIn(guest2.Id, "Scanner1");

        Assert.Equal(2, @event.Guests.Count);
        Assert.Equal(2, @event.CheckIns.Count);

        // Act
        @event.ClearGuests();

        // Assert
        Assert.Empty(@event.Guests);
        Assert.Empty(@event.CheckIns);
    }
}
