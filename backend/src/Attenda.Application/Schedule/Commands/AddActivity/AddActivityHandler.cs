using Attenda.Application.Schedule.DTOs;
using Attenda.Domain.Interfaces;
using MediatR;

namespace Attenda.Application.Schedule.Commands.AddActivity;

public class AddActivityHandler : IRequestHandler<AddActivityCommand, EventActivityDto>
{
    private readonly IEventRepository _eventRepository;
    private readonly IUnitOfWork _unitOfWork;

    public AddActivityHandler(IEventRepository eventRepository, IUnitOfWork unitOfWork)
    {
        _eventRepository = eventRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<EventActivityDto> Handle(AddActivityCommand request, CancellationToken cancellationToken)
    {
        var @event = await _eventRepository.GetByIdAsync(request.EventId, cancellationToken)
            ?? throw new KeyNotFoundException($"Evento {request.EventId} no encontrado.");

        if (@event.OrganizerId != request.UserId)
            throw new UnauthorizedAccessException("No tenés permiso para modificar este evento.");

        var activity = @event.AddActivity(
            request.Title,
            request.Description,
            request.StartTime,
            request.EndTime,
            request.Category,
            request.CustomCategory);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return new EventActivityDto(
            activity.Id,
            activity.Title,
            activity.Description,
            activity.StartTime,
            activity.EndTime,
            activity.Category,
            activity.CustomCategory,
            activity.Order);
    }
}
