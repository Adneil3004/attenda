using Attenda.Application.Guests.Commands.CreateGuest;
using Attenda.Application.Guests.Commands.DeleteAllGuests;
using Attenda.Application.Guests.Commands.DeleteGuests;
using Attenda.Application.Guests.Commands.ImportGuests;
using Attenda.Application.Guests.Commands.UpdateGuest;
using Attenda.Application.Guests.Commands.LogInvitationSent;
using Attenda.Application.Guests.Queries.GetGuests;
using Attenda.Application.Guests.Queries.GetGuestGroups;
using Attenda.Application.Guests.DTOs;
using Attenda.Application.Common.Models;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Attenda.Domain.Enums;

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

    private Guid GetUserId() => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

    [HttpGet("event/{eventId}")]
    public async Task<ActionResult<PaginatedList<GuestDto>>> Get(
        Guid eventId, 
        [FromQuery] int pageNumber = 1, 
        [FromQuery] int pageSize = 10, 
        [FromQuery] string searchTerm = null, 
        [FromQuery] Guid? groupId = null,
        [FromQuery] RsvpStatus? status = null)
    {
        var userId = GetUserId();
        var query = new GetGuestsQuery(eventId, userId, pageNumber, pageSize, searchTerm, groupId, status);
        return await _mediator.Send(query);
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
            request.Extras,
            request.PrivateNotes,
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

    [HttpPost("event/{eventId}/guest/{guestId}/log-invitation")]
    public async Task<IActionResult> LogInvitationSent(Guid eventId, Guid guestId)
    {
        var command = new LogInvitationSentCommand(eventId, guestId);
        var result = await _mediator.Send(command);

        if (!result) return NotFound();
        return Ok();
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
    string? Notes,
    string? PrivateNotes,
    int Extras = 0);
