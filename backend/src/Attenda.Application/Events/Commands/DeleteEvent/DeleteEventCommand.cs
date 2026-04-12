using Attenda.Domain.Interfaces;
using MediatR;

namespace Attenda.Application.Events.Commands.DeleteEvent;

public record DeleteEventCommand(Guid Id) : IRequest<bool>;

public class DeleteEventCommandHandler : IRequestHandler<DeleteEventCommand, bool>
{
    private readonly IEventRepository _eventRepository;
    private readonly IUnitOfWork _unitOfWork;

    public DeleteEventCommandHandler(IEventRepository eventRepository, IUnitOfWork unitOfWork)
    {
        _eventRepository = eventRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<bool> Handle(DeleteEventCommand request, CancellationToken cancellationToken)
    {
        var @event = await _eventRepository.GetByIdAsync(request.Id, cancellationToken);
        
        if (@event == null)
            return false;

        _eventRepository.Delete(@event);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        
        return true;
    }
}
