using FluentValidation;

namespace Attenda.Application.Guests.Commands.DeleteGuests;

public class DeleteGuestsCommandValidator : AbstractValidator<DeleteGuestsCommand>
{
    public DeleteGuestsCommandValidator()
    {
        RuleFor(x => x.EventId)
            .NotEmpty().WithMessage("Event ID is required.");

        RuleFor(x => x.UserId)
            .NotEmpty().WithMessage("User ID is required.");

        RuleFor(x => x.GuestIds)
            .NotNull().WithMessage("Guest IDs list cannot be null.")
            .NotEmpty().WithMessage("At least one guest ID must be provided.");

        RuleForEach(x => x.GuestIds)
            .NotEmpty().WithMessage("Guest ID cannot be empty.");
    }
}
