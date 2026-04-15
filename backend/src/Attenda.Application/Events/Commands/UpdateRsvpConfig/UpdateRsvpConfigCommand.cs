using Attenda.Domain.Aggregates.EventAggregate;
using Attenda.Domain.ValueObjects;
using Attenda.Domain.Interfaces;
using MediatR;

namespace Attenda.Application.Events.Commands.UpdateRsvpConfig;

public record UpdateRsvpConfigCommand(
    Guid EventId,
    string Headline,
    string Message,
    string? HeaderImageUrl,
    bool RequireAttendanceTracking,
    bool AllowDietaryRequirements,
    string TypographyTheme,
    string ColorTheme
) : IRequest<bool>;

public class UpdateRsvpConfigCommandHandler : IRequestHandler<UpdateRsvpConfigCommand, bool>
{
    private readonly IEventRepository _eventRepository;
    private readonly IUnitOfWork _unitOfWork;

    public UpdateRsvpConfigCommandHandler(IEventRepository eventRepository, IUnitOfWork unitOfWork)
    {
        _eventRepository = eventRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<bool> Handle(UpdateRsvpConfigCommand request, CancellationToken cancellationToken)
    {
        var @event = await _eventRepository.GetByIdAsync(request.EventId, cancellationToken);

        if (@event == null)
            return false;

        var rsvpConfig = RsvpConfiguration.Create(
            request.Headline,
            request.Message,
            request.HeaderImageUrl,
            request.RequireAttendanceTracking,
            request.AllowDietaryRequirements,
            request.TypographyTheme,
            request.ColorTheme
        );

        @event.UpdateRsvpConfiguration(rsvpConfig);

        _eventRepository.Update(@event);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return true;
    }
}
