using Attenda.Application.Events.Queries.GetUserEvents;
using Attenda.Application.Events.Commands.UpdateEvent;
using Attenda.Application.Events.Commands.CreateEvent;
using Attenda.Application.Events.Commands.DeleteEvent;
using Attenda.Application.Events.Commands.ToggleEventStatus;
using Attenda.Application.Events.Queries.GetEventDashboard;
using Attenda.Domain.Interfaces;


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
    private readonly IEventRepository _eventRepository;
    private readonly IUnitOfWork _unitOfWork;

    public EventsController(IMediator mediator, IEventRepository eventRepository, IUnitOfWork unitOfWork)
    {
        _mediator = mediator;
        _eventRepository = eventRepository;
        _unitOfWork = unitOfWork;
    }

    public record ToggleStatusRequest(bool Disable);

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
        
        if (!Guid.TryParse(userIdString, out var userId))
        {
            return Unauthorized();
        }

        var query = new GetUserEventsQuery(userId);
        var result = await _mediator.Send(query);
        
        return Ok(result);
    }

    [HttpGet("types")]
    [AllowAnonymous] // Allow anyone to see the types for initial form loading
    public IActionResult GetEventTypes()
    {
        var types = new[]
        {
            "Boda",
            "XV Años",
            "Graduación",
            "Corporativo",
            "Baby Shower",
            "Cumpleaños",
            "Bautizo",
            "Otro"
        };
        
        return Ok(types);
    }

    [HttpGet("dashboard")]
    public async Task<IActionResult> GetDashboard()
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdString, out var userId))
            return Unauthorized();

        // Get the latest/next upcoming event automatically if no ID is specified
        var query = new GetEventDashboardQuery(null, userId);
        var result = await _mediator.Send(query);
        
        if (result == null) return NotFound();

        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!Guid.TryParse(userIdString, out var userId))
            return Unauthorized();

        var query = new GetEventDashboardQuery(id, userId);
        var result = await _mediator.Send(query);
        
        if (result == null) return NotFound();

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

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var result = await _mediator.Send(new DeleteEventCommand(id));
        if (!result) return NotFound();
        return NoContent();
    }

    [HttpPost("{id}/status")]
    public async Task<IActionResult> ToggleStatus(Guid id, [FromBody] ToggleStatusRequest request)
    {
        var result = await _mediator.Send(new ToggleEventStatusCommand(id, request.Disable));
        if (!result) return NotFound();
        return Ok(result);
    }

    [HttpPost("{id}/image")]
    public async Task<IActionResult> UploadImage(Guid id, [FromForm] IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest("No file uploaded");

        // Advanced validation: Extension and Size
        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".webp" };
        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        
        if (!allowedExtensions.Contains(extension))
            return BadRequest("Invalid file type. Only JPG, PNG, and WEBP are allowed.");

        if (file.Length > 5 * 1024 * 1024) // 5MB limit
            return BadRequest("File too large. Maximum size is 5MB.");

        var uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
        if (!Directory.Exists(uploadsPath))
            Directory.CreateDirectory(uploadsPath);

        var fileName = $"{id}_{DateTime.UtcNow.Ticks}{extension}";
        var filePath = Path.Combine(uploadsPath, fileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        var imageUrl = $"{Request.Scheme}://{Request.Host}/uploads/{fileName}";
        
        var @event = await _eventRepository.GetByIdAsync(id, HttpContext.RequestAborted);
        if (@event == null) return NotFound();

        @event.UpdateDetails(
            @event.Name,
            @event.Description,
            @event.Date,
            @event.EventType,
            @event.Celebrants?.ToArray(),
            @event.OrganizerName,
            @event.ReligiousAddress,
            @event.VenueAddress,
            imageUrl
        );

        _eventRepository.Update(@event);
        await _unitOfWork.SaveChangesAsync(HttpContext.RequestAborted);
        
        return Ok(new { imageUrl });
    }
}

