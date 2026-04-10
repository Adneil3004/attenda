using FluentValidation;

namespace Attenda.Application.Events.Commands.CreateEvent;

public class CreateEventValidator : AbstractValidator<CreateEventCommand>
{
    public CreateEventValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(200);
        RuleFor(x => x.StartDate).NotEmpty().GreaterThanOrEqualTo(DateTime.Today);
        RuleFor(x => x.OrganizerId).NotEmpty();
        
        RuleFor(x => x)
            .Must(x => x.EndDate == null || x.EndDate >= x.StartDate)
            .WithMessage("End date must be greater than or equal to start date.");
    }
}
