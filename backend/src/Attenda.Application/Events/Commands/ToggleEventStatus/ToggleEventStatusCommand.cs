using Attenda.Domain.Enums;
using Attenda.Domain.Interfaces;
using MediatR;

namespace Attenda.Application.Events.Commands.ToggleEventStatus;

public record ToggleEventStatusCommand(Guid Id, bool Disable) : IRequest<bool>;

public class ToggleEventStatusCommandHandler : IRequestHandler<ToggleEventStatusCommand, bool>
{
    private readonly IEventRepository _eventRepository;
    private readonly IUnitOfWork _unitOfWork;

    public ToggleEventStatusCommandHandler(IEventRepository eventRepository, IUnitOfWork unitOfWork)
    {
        _eventRepository = eventRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<bool> Handle(ToggleEventStatusCommand request, CancellationToken cancellationToken)
    {
        var @event = await _eventRepository.GetByIdAsync(request.Id, cancellationToken);
        
        if (@event == null)
            return false;

        var newStatus = request.Disable ? EventStatus.Cancelled : EventStatus.Active;
        @event.SetStatus(newStatus);

        _eventRepository.Update(@event);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        
        return true;
    }
}
