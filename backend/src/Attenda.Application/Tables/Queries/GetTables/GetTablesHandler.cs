using Attenda.Application.Tables.DTOs;
using Attenda.Domain.Interfaces;
using MediatR;

namespace Attenda.Application.Tables.Queries.GetTables;

public class GetTablesHandler : IRequestHandler<GetTablesQuery, List<TableDto>>
{
    private readonly IEventRepository _eventRepository;

    public GetTablesHandler(IEventRepository eventRepository)
    {
        _eventRepository = eventRepository;
    }

    public async Task<List<TableDto>> Handle(GetTablesQuery request, CancellationToken cancellationToken)
    {
        var @event = await _eventRepository.GetByIdAsync(request.EventId, cancellationToken)
            ?? throw new KeyNotFoundException($"Evento {request.EventId} no encontrado.");

        if (@event.OrganizerId != request.UserId)
            throw new UnauthorizedAccessException("No tenés permiso para ver las mesas de este evento.");

        return @event.Tables.Select(t => 
        {
            var tableGuests = @event.Guests.Where(g => g.TableId == t.Id).ToList();
            var occupantsCount = tableGuests.Count;
            var guestDtos = tableGuests.Select(g => new TableGuestDto(
                g.Id,
                g.FirstName,
                g.LastName,
                g.RsvpStatus.ToString()
            )).ToList();

            return new TableDto(
                t.Id,
                t.Name,
                t.Capacity,
                t.Priority.ToString(),
                occupantsCount,
                guestDtos
            );
        }).ToList();
    }
}
