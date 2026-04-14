using Attenda.Domain.Interfaces;
using MediatR;

namespace Attenda.Application.Tables.Commands.UnassignGuestFromTable;

public class UnassignGuestFromTableHandler : IRequestHandler<UnassignGuestFromTableCommand>
{
    private readonly IEventRepository _eventRepository;
    private readonly IUnitOfWork _unitOfWork;

    public UnassignGuestFromTableHandler(IEventRepository eventRepository, IUnitOfWork unitOfWork)
    {
        _eventRepository = eventRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task Handle(UnassignGuestFromTableCommand request, CancellationToken cancellationToken)
    {
        var @event = await _eventRepository.GetByIdAsync(request.EventId, cancellationToken)
            ?? throw new KeyNotFoundException($"Evento {request.EventId} no encontrado.");

        if (@event.OrganizerId != request.UserId)
            throw new UnauthorizedAccessException("No tenés permiso para modificar este evento.");

        @event.UnassignGuestFromTable(request.GuestId);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }
}
