using Attenda.Application.Events.Commands.CreateEvent;
using Attenda.Application.Events.Queries.GetEventOverview;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Attenda.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class EventsController : ControllerBase
{
    private readonly IMediator _mediator;

    public EventsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateEventCommand command)
    {
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [HttpGet("overview/{eventId?}")]
    public async Task<IActionResult> GetOverview(Guid? eventId)
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdString, out var userId))
        {
            return Unauthorized();
        }

        var query = new GetEventOverviewQuery(eventId, userId);
        var result = await _mediator.Send(query);
        return Ok(result);
    }
}
