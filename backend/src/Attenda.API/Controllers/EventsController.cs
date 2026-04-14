using Attenda.Application.Events.Queries.GetUserEvents;
using Attenda.Application.Events.Commands.UpdateEvent;
using Attenda.Application.Events.Commands.CreateEvent;
using Attenda.Application.Events.Commands.DeleteEvent;
using Attenda.Application.Events.Commands.ToggleEventStatus;
using Attenda.Application.Events.Queries.GetEventDashboard;
using Attenda.Application.Common.Interfaces;
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
    private readonly IImageStorageService _imageStorageService;

    public EventsController(IMediator mediator, IEventRepository eventRepository, IUnitOfWork unitOfWork, IImageStorageService imageStorageService)
    {
        _mediator = mediator;
        _eventRepository = eventRepository;
        _unitOfWork = unitOfWork;
        _imageStorageService = imageStorageService;
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
            "Bautizo",
            "Cumpleaños",
            "Baby Shower",
            "Graduación",
            "Fin de año",
            "Aniversario",
            "Congreso",
            "Lanzamiento de Producto",
            "Inauguración",
            "Workshop / Capacitación",
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

        // Simple validation: Extension and Size
        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".webp" };
        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        
        if (!allowedExtensions.Contains(extension))
            return BadRequest("Invalid file type. Only JPG, PNG, and WEBP are allowed.");

        // We can handle larger files now because we resize them on the server
        if (file.Length > 10 * 1024 * 1024) // 10MB limit
            return BadRequest("File too large. Maximum size is 10MB.");

        string imageUrl;
        try
        {
            using (var stream = file.OpenReadStream())
            {
                // The service handles resizing, compression to < 1MB and upload to Supabase
                imageUrl = await _imageStorageService.UploadImageAsync(stream, file.FileName, HttpContext.RequestAborted);
            }
        }
        catch (Exception ex)
        {
            // IMPORTANT: Return the actual error message so the frontend can display it for diagnostics
            return StatusCode(500, new { message = "Error processing or uploading image", details = ex.Message });
        }

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
            imageUrl,
            @event.IsBusiness
        );

        _eventRepository.Update(@event);
        await _unitOfWork.SaveChangesAsync(HttpContext.RequestAborted);
        
        return Ok(new { imageUrl });
    }
}

