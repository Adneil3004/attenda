using Attenda.Application.Guests.Queries.GetGuestGroups;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Attenda.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class GroupsController : ControllerBase
{
    private readonly IMediator _mediator;

    public GroupsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("event/{eventId}")]
    public async Task<IActionResult> GetByEvent(Guid eventId)
    {
        try 
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            Serilog.Log.Information("[GroupsController] GetByEvent called. EventId: {EventId}, UserId: {UserId}", eventId, userIdString);

            if (!Guid.TryParse(userIdString, out var userId))
            {
                Serilog.Log.Warning("[GroupsController] Unauthorized: Invalid UserId string '{UserIdString}'", userIdString);
                return Unauthorized();
            }

            var query = new GetGuestGroupsQuery(eventId, userId);
            var result = await _mediator.Send(query);
            return Ok(result);
        }
        catch (Exception ex)
        {
            Serilog.Log.Error(ex, "[GroupsController] Error in GetByEvent. EventId: {EventId}", eventId);
            return StatusCode(500, new { message = ex.Message, detail = ex.ToString() });
        }
    }
}
