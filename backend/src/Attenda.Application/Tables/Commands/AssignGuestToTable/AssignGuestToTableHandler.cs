using Attenda.Domain.Interfaces;
using MediatR;

namespace Attenda.Application.Tables.Commands.AssignGuestToTable;

public class AssignGuestToTableHandler : IRequestHandler<AssignGuestToTableCommand>
{
    private readonly IEventRepository _eventRepository;
    private readonly IUnitOfWork _unitOfWork;

    public AssignGuestToTableHandler(IEventRepository eventRepository, IUnitOfWork unitOfWork)
    {
        _eventRepository = eventRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task Handle(AssignGuestToTableCommand request, CancellationToken cancellationToken)
    {
        var @event = await _eventRepository.GetByIdAsync(request.EventId, cancellationToken)
            ?? throw new KeyNotFoundException($"Evento {request.EventId} no encontrado.");

        if (@event.OrganizerId != request.UserId)
            throw new UnauthorizedAccessException("No tenés permiso para modificar este evento.");

        @event.AssignGuestToTable(request.GuestId, request.TableId);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }
}
