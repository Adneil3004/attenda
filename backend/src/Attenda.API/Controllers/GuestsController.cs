using Attenda.Application.Guests.Commands.CreateGuest;
using Attenda.Application.Guests.Commands.DeleteAllGuests;
using Attenda.Application.Guests.Commands.DeleteGuests;
using Attenda.Application.Guests.Commands.ImportGuests;
using Attenda.Application.Guests.Commands.UpdateGuest;
using Attenda.Application.Guests.Queries.GetGuests;
using Attenda.Application.Guests.Queries.GetGuestGroups;
using Attenda.Application.Guests.DTOs;
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

    [HttpGet("event/{eventId}")]
    public async Task<IActionResult> GetGuests(Guid eventId)
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdString, out var userId))
        {
            return Unauthorized();
        }

        var query = new GetGuestsQuery(eventId, userId);
        var result = await _mediator.Send(query);

        return Ok(result);
    }

    [HttpGet("groups/{eventId}")]
    public async Task<IActionResult> GetGroups(Guid eventId)
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdString, out var userId))
        {
            return Unauthorized();
        }

        var query = new GetGuestGroupsQuery(eventId, userId);
        var result = await _mediator.Send(query);

        return Ok(result);
    }

    [HttpPost("import")]
    public async Task<IActionResult> Import([FromBody] ImportGuestsRequest request)
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdString, out var userId))
        {
            return Unauthorized();
        }

        var command = new ImportGuestsCommand(request.EventId, request.Guests, userId);
        await _mediator.Send(command);

        return NoContent();
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateGuestRequest request)
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdString, out var userId))
        {
            return Unauthorized();
        }

        var command = new CreateGuestCommand(
            request.EventId,
            request.FirstName,
            request.LastName,
            request.PhoneNumber,
            request.PlusOnes,
            request.RsvpStatus,
            request.GuestGroupId,
            request.GroupName,
            request.DietaryRestrictions,
            request.Notes,
            userId);

        var guestId = await _mediator.Send(command);

        return Ok(guestId);
    }

    [HttpPut("{guestId}")]
    public async Task<IActionResult> Update(Guid guestId, [FromBody] UpdateGuestRequest request)
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdString, out var userId))
        {
            return Unauthorized();
        }

        var command = new UpdateGuestCommand(
            request.EventId,
            guestId,
            request.FirstName,
            request.LastName,
            request.PhoneNumber,
            request.PlusOnes,
            request.RsvpStatus,
            request.GuestGroupId,
            request.GroupName,
            request.DietaryRestrictions,
            request.Notes,
            userId);

        await _mediator.Send(command);

        return NoContent();
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

    [HttpDelete("event/{eventId}/all")]
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
public record ImportGuestsRequest(Guid EventId, List<GuestImportDto> Guests);
public record CreateGuestRequest(
    Guid EventId,
    string FirstName,
    string LastName,
    string PhoneNumber,
    int PlusOnes,
    string RsvpStatus,
    Guid? GuestGroupId,
    string? GroupName,
    List<string> DietaryRestrictions,
    string? Notes);
public record UpdateGuestRequest(
    Guid EventId,
    string FirstName,
    string LastName,
    string PhoneNumber,
    int PlusOnes,
    string RsvpStatus,
    Guid? GuestGroupId,
    string? GroupName,
    List<string> DietaryRestrictions,
    string? Notes);
