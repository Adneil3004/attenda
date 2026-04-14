using Attenda.Application.Tables.DTOs;
using Attenda.Domain.Interfaces;
using MediatR;

namespace Attenda.Application.Tables.Commands.CreateTable;

public class CreateTableHandler : IRequestHandler<CreateTableCommand, TableDto>
{
    private readonly IEventRepository _eventRepository;
    private readonly IUnitOfWork _unitOfWork;

    public CreateTableHandler(IEventRepository eventRepository, IUnitOfWork unitOfWork)
    {
        _eventRepository = eventRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<TableDto> Handle(CreateTableCommand request, CancellationToken cancellationToken)
    {
        var @event = await _eventRepository.GetByIdAsync(request.EventId, cancellationToken)
            ?? throw new KeyNotFoundException($"Evento {request.EventId} no encontrado.");

        if (@event.OrganizerId != request.UserId)
            throw new UnauthorizedAccessException("No tenés permiso para modificar este evento.");

        var table = @event.AddTable(request.Name, request.Capacity, request.Priority);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return new TableDto(table.Id, table.Name, table.Capacity, table.Priority.ToString(), 0, []);
    }
}
