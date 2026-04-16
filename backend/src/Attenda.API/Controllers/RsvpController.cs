using Attenda.Application.Guests.Queries.GetGuestByToken;
using Attenda.Application.Guests.Commands.SubmitRsvpResponse;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Attenda.API.Controllers;

[AllowAnonymous]
[ApiController]
[Route("api/[controller]")]
public class RsvpController : ControllerBase
{
    private readonly IMediator _mediator;

    public RsvpController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("{token}")]
    public async Task<IActionResult> GetByToken(string token)
    {
        var result = await _mediator.Send(new GetGuestByTokenQuery(token));
        if (result == null) return NotFound();
        return Ok(result);
    }

    [HttpPost("confirm")]
    public async Task<IActionResult> Confirm([FromBody] SubmitRsvpResponseCommand command)
    {
        var result = await _mediator.Send(command);
        if (!result) return NotFound();
        return Ok();
    }
}
