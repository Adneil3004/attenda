using Attenda.Domain.Interfaces;
using MediatR;

namespace Attenda.Application.Schedule.Commands.ReorderActivities;

public class ReorderActivitiesHandler : IRequestHandler<ReorderActivitiesCommand, Unit>
{
    private readonly IEventRepository _eventRepository;
    private readonly IUnitOfWork _unitOfWork;

    public ReorderActivitiesHandler(IEventRepository eventRepository, IUnitOfWork unitOfWork)
    {
        _eventRepository = eventRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Unit> Handle(ReorderActivitiesCommand request, CancellationToken cancellationToken)
    {
        var @event = await _eventRepository.GetByIdAsync(request.EventId, cancellationToken)
            ?? throw new KeyNotFoundException($"Evento {request.EventId} no encontrado.");

        if (@event.OrganizerId != request.UserId)
            throw new UnauthorizedAccessException("No tenés permiso para modificar este evento.");

        @event.ReorderActivities(request.ActivityIds);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}
