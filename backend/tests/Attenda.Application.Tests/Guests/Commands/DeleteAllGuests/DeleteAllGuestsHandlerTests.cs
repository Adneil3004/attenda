using Attenda.Application.Guests.Commands.DeleteAllGuests;
using Attenda.Domain.Aggregates.EventAggregate;
using Attenda.Domain.Interfaces;
using Attenda.Domain.ValueObjects;
using NSubstitute;
using Xunit;

namespace Attenda.Application.Tests.Guests.Commands.DeleteAllGuests;

public class DeleteAllGuestsHandlerTests
{
    private readonly IEventRepository _eventRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly DeleteAllGuestsHandler _handler;

    public DeleteAllGuestsHandlerTests()
    {
        _eventRepository = Substitute.For<IEventRepository>();
        _unitOfWork = Substitute.For<IUnitOfWork>();
        _handler = new DeleteAllGuestsHandler(_eventRepository, _unitOfWork);
    }

    [Fact]
    public async Task Handle_WhenEventExistsAndUserIsOrganizer_ShouldClearGuestsAndSave()
    {
        // Arrange
        var organizerId = Guid.NewGuid();
        var eventId = Guid.NewGuid();
        
        var @event = Event.Create(
            "Test Event",
            "Description",
            EventDate.Create(DateTime.UtcNow.AddDays(1)),
            organizerId);

        @event.AddGuest("John", "Doe", PhoneNumber.Create("+1234567890"));
        
        var command = new DeleteAllGuestsCommand(eventId, organizerId);

        _eventRepository.GetByIdAsync(eventId, Arg.Any<CancellationToken>())
            .Returns(@event);

        // Act
        await _handler.Handle(command, CancellationToken.None);

        // Assert
        Assert.Empty(@event.Guests);
        _eventRepository.Received(1).Update(@event);
        await _unitOfWork.Received(1).SaveChangesAsync(Arg.Any<CancellationToken>());
    }

    [Fact]
    public async Task Handle_WhenEventDoesNotExist_ShouldThrowKeyNotFoundException()
    {
        // Arrange
        var eventId = Guid.NewGuid();
        var command = new DeleteAllGuestsCommand(eventId, Guid.NewGuid());

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

        var command = new DeleteAllGuestsCommand(eventId, otherUserId);

        _eventRepository.GetByIdAsync(eventId, Arg.Any<CancellationToken>())
            .Returns(@event);

        // Act & Assert
        await Assert.ThrowsAsync<UnauthorizedAccessException>(() => _handler.Handle(command, CancellationToken.None));
    }
}
