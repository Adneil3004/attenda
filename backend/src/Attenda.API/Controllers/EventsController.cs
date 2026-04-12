using Attenda.Application.Events.Queries.GetUserEvents;
using Attenda.Application.Events.Commands.UpdateEvent;
using Attenda.Application.Events.Commands.CreateEvent;
using Attenda.Application.Events.Queries.GetEventDashboard;


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
    public async Task<IActionResult> Create([FromBody] CreateEventCommand commandFromBody)
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdString, out var organizerId))
            return Unauthorized();

        // Security: override OrganizerId from the JWT — never trust the request body for this.
        var command = commandFromBody with { OrganizerId = organizerId };
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [HttpGet]
    public async Task<IActionResult> List()
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        Console.WriteLine($"[DEBUG] List events for UserId: {userIdString}");
        
        if (!Guid.TryParse(userIdString, out var userId))
        {
            Console.WriteLine("[DEBUG] Invalid GUID or User session missing NameIdentifier claim");
            return Unauthorized();
        }

        var query = new GetUserEventsQuery(userId);
        var result = await _mediator.Send(query);
        Console.WriteLine($"[DEBUG] Found {result?.Count ?? 0} events");
        
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        Console.WriteLine($"[DEBUG] GetEventById: {id} for UserId: {userIdString}");

        if (!Guid.TryParse(userIdString, out var userId))
            return Unauthorized();

        // Reusing dashboard logic for now but filtered by user
        var query = new GetEventDashboardQuery(id, userId);
        var result = await _mediator.Send(query);
        
        if (result == null) 
        {
            Console.WriteLine($"[DEBUG] Event {id} not found or doesn't belong to user {userId}");
            return NotFound();
        }

        return Ok(result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateEventCommand commandFromBody)
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdString, out var userId))
            return Unauthorized();

        if (id != commandFromBody.Id)
            return BadRequest("ID mismatch");

        var result = await _mediator.Send(commandFromBody);
        if (!result) return NotFound();
        
        return Ok(result);
    }
}

