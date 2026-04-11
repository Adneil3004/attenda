using Attenda.Application.Guests.Commands.DeleteAllGuests;
using Attenda.Application.Guests.Commands.DeleteGuests;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Attenda.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class GuestsController : ControllerBase
{
    private readonly IMediator _mediator;

    public GuestsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpDelete("batch")]
    public async Task<IActionResult> DeleteBatch([FromBody] DeleteGuestsRequest request)
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdString, out var userId))
        {
            return Unauthorized();
        }

        var command = new DeleteGuestsCommand(request.EventId, request.GuestIds, userId);
        await _mediator.Send(command);

        return NoContent();
    }

    [HttpDelete("all/{eventId}")]
    public async Task<IActionResult> DeleteAll(Guid eventId)
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdString, out var userId))
        {
            return Unauthorized();
        }

        var command = new DeleteAllGuestsCommand(eventId, userId);
        await _mediator.Send(command);

        return NoContent();
    }
}

public record DeleteGuestsRequest(Guid EventId, List<Guid> GuestIds);
