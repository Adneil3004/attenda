using Attenda.Domain.Interfaces;
using MediatR;

namespace Attenda.Application.Schedule.Commands.UpdateActivity;

public class UpdateActivityHandler : IRequestHandler<UpdateActivityCommand, Unit>
{
    private readonly IEventRepository _eventRepository;
    private readonly IUnitOfWork _unitOfWork;

    public UpdateActivityHandler(IEventRepository eventRepository, IUnitOfWork unitOfWork)
    {
        _eventRepository = eventRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Unit> Handle(UpdateActivityCommand request, CancellationToken cancellationToken)
    {
        var @event = await _eventRepository.GetByIdAsync(request.EventId, cancellationToken)
            ?? throw new KeyNotFoundException($"Evento {request.EventId} no encontrado.");

        if (@event.OrganizerId != request.UserId)
            throw new UnauthorizedAccessException("No tenés permiso para modificar este evento.");

        @event.UpdateActivity(
            request.ActivityId,
            request.Title,
            request.Description,
            request.StartTime,
            request.EndTime,
            request.Category,
            request.CustomCategory);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}
