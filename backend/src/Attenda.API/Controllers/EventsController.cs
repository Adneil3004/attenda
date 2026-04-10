using Attenda.Application.Events.Commands.CreateEvent;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

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
}
