using Attenda.Application.Guests.DTOs;
using Attenda.Domain.Aggregates.EventAggregate;
using Attenda.Domain.Interfaces;
using Attenda.Domain.ValueObjects;
using MediatR;

namespace Attenda.Application.Guests.Commands.ImportGuests;

public class ImportGuestsHandler : IRequestHandler<ImportGuestsCommand, Unit>
{
    private readonly IEventRepository _eventRepository;
    private readonly IUnitOfWork _unitOfWork;

    public ImportGuestsHandler(IEventRepository eventRepository, IUnitOfWork unitOfWork)
    {
        _eventRepository = eventRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Unit> Handle(ImportGuestsCommand request, CancellationToken cancellationToken)
    {
        var @event = await _eventRepository.GetByIdAsync(request.EventId, cancellationToken);

        if (@event == null)
        {
            throw new KeyNotFoundException($"Event {request.EventId} not found.");
        }

        if (@event.OrganizerId != request.UserId)
        {
            throw new UnauthorizedAccessException("You do not have permission to import guests for this event.");
        }

        foreach (var guestDto in request.Guests)
        {
            Guid? groupId = null;
            if (!string.IsNullOrWhiteSpace(guestDto.GroupName))
            {
                var group = @event.GuestGroups.FirstOrDefault(g => g.Name.Equals(guestDto.GroupName, StringComparison.OrdinalIgnoreCase));
                if (group == null)
                {
                    @event.AddGuestGroup(guestDto.GroupName);
                    group = @event.GuestGroups.First(g => g.Name.Equals(guestDto.GroupName, StringComparison.OrdinalIgnoreCase));
                }
                groupId = group.Id;
            }

            var dietaryRestrictions = guestDto.DietaryRestrictions?
                .Select(dr => DietaryRestriction.Create(dr))
                .ToList();

            @event.AddGuest(
                guestDto.FirstName,
                guestDto.LastName,
                EmailAddress.Create(guestDto.Email),
                groupId,
                dietaryRestrictions,
                guestDto.PlusOne,
                guestDto.Notes
            );
        }

        _eventRepository.Update(@event);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}
