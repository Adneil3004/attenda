using Attenda.Application.Guests.Commands.DeleteGuests;
using Attenda.Domain.Aggregates.EventAggregate;
using Attenda.Domain.Interfaces;
using Attenda.Domain.ValueObjects;
using NSubstitute;
using Xunit;

namespace Attenda.Application.Tests.Guests.Commands.DeleteGuests;

public class DeleteGuestsHandlerTests
{
    private readonly IEventRepository _eventRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly DeleteGuestsHandler _handler;

    public DeleteGuestsHandlerTests()
    {
        _eventRepository = Substitute.For<IEventRepository>();
        _unitOfWork = Substitute.For<IUnitOfWork>();
        _handler = new DeleteGuestsHandler(_eventRepository, _unitOfWork);
    }

    [Fact]
    public async Task Handle_WhenEventExistsAndUserIsOrganizer_ShouldRemoveGuestsAndSave()
    {
        // Arrange
        var organizerId = Guid.NewGuid();
        var eventId = Guid.NewGuid();
        var guestId1 = Guid.NewGuid();
        var guestId2 = Guid.NewGuid();
        
        var @event = Event.Create(
            "Test Event",
            "Description",
            EventDate.Create(DateTime.UtcNow.AddDays(1)),
            organizerId);

        // Add dummy guests to the event internally if possible, or just mock the call to remove them
        // In our case, the Event object is real, but the repository is mocked.
        @event.AddGuest("John", "Doe", EmailAddress.Create("john@example.com"));
        
        var guestIds = new List<Guid> { guestId1, guestId2 };
        var command = new DeleteGuestsCommand(eventId, guestIds, organizerId);

        _eventRepository.GetByIdAsync(eventId, Arg.Any<CancellationToken>())
            .Returns(@event);

        // Act
        await _handler.Handle(command, CancellationToken.None);

        // Assert
        _eventRepository.Received(1).Update(@event);
        await _unitOfWork.Received(1).SaveChangesAsync(Arg.Any<CancellationToken>());
    }

    [Fact]
    public async Task Handle_WhenEventDoesNotExist_ShouldThrowKeyNotFoundException()
    {
        // Arrange
        var eventId = Guid.NewGuid();
        var command = new DeleteGuestsCommand(eventId, new List<Guid>(), Guid.NewGuid());

        _eventRepository.GetByIdAsync(eventId, Arg.Any<CancellationToken>())
            .Returns((Event?)null);

        // Act & Assert
        await Assert.ThrowsAsync<KeyNotFoundException>(() => _handler.Handle(command, CancellationToken.None));
    }

    [Fact]
    public async Task Handle_WhenUserIsNotOrganizer_ShouldThrowUnauthorizedAccessException()
    {
        // Arrange
        var organizerId = Guid.NewGuid();
        var otherUserId = Guid.NewGuid();
        var eventId = Guid.NewGuid();
        
        var @event = Event.Create(
            "Test Event",
            "Description",
            EventDate.Create(DateTime.UtcNow.AddDays(1)),
            organizerId);

        var command = new DeleteGuestsCommand(eventId, new List<Guid>(), otherUserId);

        _eventRepository.GetByIdAsync(eventId, Arg.Any<CancellationToken>())
            .Returns(@event);

        // Act & Assert
        await Assert.ThrowsAsync<UnauthorizedAccessException>(() => _handler.Handle(command, CancellationToken.None));
    }
}
