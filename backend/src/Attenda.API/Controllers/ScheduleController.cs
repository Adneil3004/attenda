using Attenda.Application.Schedule.Commands.AddActivity;
using Attenda.Application.Schedule.Commands.RemoveActivity;
using Attenda.Application.Schedule.Commands.ReorderActivities;
using Attenda.Application.Schedule.Commands.UpdateActivity;
using Attenda.Application.Schedule.Queries.GetSchedule;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Attenda.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ScheduleController : ControllerBase
{
    private readonly IMediator _mediator;

    public ScheduleController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("{eventId}")]
    public async Task<IActionResult> GetSchedule(Guid eventId)
    {
        var query = new GetScheduleQuery(eventId);
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpPost("{eventId}/activities")]
    public async Task<IActionResult> AddActivity(Guid eventId, [FromBody] AddActivityCommand commandFromBody)
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdString, out var userId))
            return Unauthorized();

        if (eventId != commandFromBody.EventId)
            return BadRequest("ID de evento no coincide");

        var command = commandFromBody with { UserId = userId };
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [HttpPut("{eventId}/activities/{activityId}")]
    public async Task<IActionResult> UpdateActivity(Guid eventId, Guid activityId, [FromBody] UpdateActivityCommand commandFromBody)
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdString, out var userId))
            return Unauthorized();

        if (eventId != commandFromBody.EventId || activityId != commandFromBody.ActivityId)
            return BadRequest("IDs no coinciden");

        var command = commandFromBody with { UserId = userId };
        await _mediator.Send(command);
        return NoContent();
    }

    [HttpDelete("{eventId}/activities/{activityId}")]
    public async Task<IActionResult> RemoveActivity(Guid eventId, Guid activityId)
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdString, out var userId))
            return Unauthorized();

        var command = new RemoveActivityCommand(eventId, activityId, userId);
        await _mediator.Send(command);
        return NoContent();
    }

    [HttpPut("{eventId}/reorder")]
    public async Task<IActionResult> ReorderActivities(Guid eventId, [FromBody] IEnumerable<Guid> activityIds)
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdString, out var userId))
            return Unauthorized();

        var command = new ReorderActivitiesCommand(eventId, activityIds, userId);
        await _mediator.Send(command);
        return NoContent();
    }
}
