using Attenda.Domain.Interfaces;
using MediatR;

namespace Attenda.Application.Tables.Commands.UpdateTable;

public class UpdateTableHandler : IRequestHandler<UpdateTableCommand>
{
    private readonly IEventRepository _eventRepository;
    private readonly IUnitOfWork _unitOfWork;

    public UpdateTableHandler(IEventRepository eventRepository, IUnitOfWork unitOfWork)
    {
        _eventRepository = eventRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task Handle(UpdateTableCommand request, CancellationToken cancellationToken)
    {
        var @event = await _eventRepository.GetByIdAsync(request.EventId, cancellationToken)
            ?? throw new KeyNotFoundException($"Evento {request.EventId} no encontrado.");

        if (@event.OrganizerId != request.UserId)
            throw new UnauthorizedAccessException("No tenés permiso para modificar este evento.");

        @event.UpdateTable(request.TableId, request.Name, request.Capacity, request.Priority);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }
}
