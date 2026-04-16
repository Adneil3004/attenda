using Attenda.Domain.Aggregates.EventAggregate;
using Attenda.Domain.Interfaces;
using MediatR;

namespace Attenda.Application.Guests.Commands.LogInvitationSent;

public record LogInvitationSentCommand(Guid EventId, Guid GuestId) : IRequest<bool>;

public class LogInvitationSentHandler : IRequestHandler<LogInvitationSentCommand, bool>
{
    private readonly IEventRepository _eventRepository;
    private readonly IUnitOfWork _unitOfWork;

    public LogInvitationSentHandler(IEventRepository eventRepository, IUnitOfWork unitOfWork)
    {
        _eventRepository = eventRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<bool> Handle(LogInvitationSentCommand request, CancellationToken cancellationToken)
    {
        var @event = await _eventRepository.GetByIdAsync(request.EventId, cancellationToken);
        if (@event == null) return false;

        var guest = @event.Guests.FirstOrDefault(g => g.Id == request.GuestId);
        if (guest == null) return false;

        guest.AddLogEntry("invitation_sent", "Se envió el link de RSVP al invitado.");
        
        _eventRepository.Update(@event);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return true;
    }
}
