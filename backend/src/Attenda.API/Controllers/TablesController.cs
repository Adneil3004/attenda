using Attenda.Application.Tables.Commands.AssignGuestToTable;
using Attenda.Application.Tables.Commands.CreateTable;
using Attenda.Application.Tables.Commands.DeleteTable;
using Attenda.Application.Tables.Commands.UnassignGuestFromTable;
using Attenda.Application.Tables.Commands.UpdateTable;
using Attenda.Application.Tables.Queries.GetTables;
using Attenda.Domain.Enums;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Attenda.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class TablesController : ControllerBase
{
    private readonly IMediator _mediator;

    public TablesController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("event/{eventId}")]
    public async Task<IActionResult> GetTables(Guid eventId)
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdString, out var userId)) return Unauthorized();

        var query = new GetTablesQuery(eventId, userId);
        var result = await _mediator.Send(query);

        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateTableRequest request)
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdString, out var userId)) return Unauthorized();

        if (!Enum.TryParse<TablePriority>(request.Priority, true, out var priorityEnum))
        {
            return BadRequest(new { Message = "Prioridad no válida. Valores permitidos: Normal, VIP." });
        }

        if (request.EventId == Guid.Empty)
        {
            return BadRequest(new { Message = "EventId es requierido." });
        }

        var command = new CreateTableCommand(request.EventId, request.Name, request.Capacity, priorityEnum, userId);
        var result = await _mediator.Send(command);

        return Ok(result);
    }

    [HttpPut("{tableId}")]
    public async Task<IActionResult> Update(Guid tableId, [FromBody] UpdateTableRequest request)
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdString, out var userId)) return Unauthorized();

        if (!Enum.TryParse<TablePriority>(request.Priority, true, out var priorityEnum))
        {
            return BadRequest(new { Message = "Prioridad no válida. Valores permitidos: Normal, VIP." });
        }

        var command = new UpdateTableCommand(request.EventId, tableId, request.Name, request.Capacity, priorityEnum, userId);
        await _mediator.Send(command);

        return Ok();
    }

    [HttpDelete("{tableId}/event/{eventId}")]
    public async Task<IActionResult> Delete(Guid tableId, Guid eventId)
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdString, out var userId)) return Unauthorized();

        var command = new DeleteTableCommand(eventId, tableId, userId);
        await _mediator.Send(command);

        return NoContent();
    }

    [HttpPost("{tableId}/assign-guest/{guestId}/event/{eventId}")]
    public async Task<IActionResult> AssignGuest(Guid tableId, Guid guestId, Guid eventId)
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdString, out var userId)) return Unauthorized();

        var command = new AssignGuestToTableCommand(eventId, tableId, guestId, userId);
        
        try 
        {
            await _mediator.Send(command);
            return Ok();
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { Message = ex.Message });
        }
    }

    [HttpPost("unassign-guest/{guestId}/event/{eventId}")]
    public async Task<IActionResult> UnassignGuest(Guid guestId, Guid eventId)
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdString, out var userId)) return Unauthorized();

        var command = new UnassignGuestFromTableCommand(eventId, guestId, userId);
        await _mediator.Send(command);

        return Ok();
    }
}

public record CreateTableRequest(Guid EventId, string Name, int Capacity, string Priority);
public record UpdateTableRequest(Guid EventId, string Name, int Capacity, string Priority);
