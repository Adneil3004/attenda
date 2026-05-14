using Attenda.Application.Schedule.DTOs;
using Attenda.Domain.Interfaces;
using MediatR;

namespace Attenda.Application.Schedule.Queries.GetSchedule;

public class GetScheduleHandler : IRequestHandler<GetScheduleQuery, IEnumerable<EventActivityDto>>
{
    private readonly IEventRepository _eventRepository;

    public GetScheduleHandler(IEventRepository eventRepository)
    {
        _eventRepository = eventRepository;
    }

    public async Task<IEnumerable<EventActivityDto>> Handle(GetScheduleQuery request, CancellationToken cancellationToken)
    {
        var @event = await _eventRepository.GetByIdAsync(request.EventId, cancellationToken)
            ?? throw new KeyNotFoundException($"Evento {request.EventId} no encontrado.");

        return @event.Activities
            .OrderBy(a => a.Order)
            .Select(a => new EventActivityDto(
                a.Id,
                a.Title,
                a.Description,
                a.StartTime,
                a.EndTime,
                a.Category,
                a.CustomCategory,
                a.Order));
    }
}
