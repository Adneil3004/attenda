using Attenda.Application.Tasks.Commands.CreateTask;
using Attenda.Application.Tasks.Commands.DeleteTask;
using Attenda.Application.Tasks.Commands.UpdateTask;
using Attenda.Application.Tasks.Commands.UpdateTaskStatus;
using Attenda.Application.Tasks.Queries.GetTasks;
using Attenda.Application.Tasks.DTOs;
using Attenda.Domain.Enums;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TaskStatus = Attenda.Domain.Enums.TaskStatus;

namespace Attenda.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class TasksController : ControllerBase
{
    private readonly IMediator _mediator;

    public TasksController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetTasks([FromQuery] Guid eventId)
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdString, out var userId))
        {
            return Unauthorized();
        }

        var query = new GetTasksQuery(eventId, userId);
        var result = await _mediator.Send(query);

        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<TaskItemDto>> Create([FromBody] CreateTaskRequest request)
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdString, out var userId))
        {
            return Unauthorized();
        }

        var command = new CreateTaskCommand(
            request.EventId,
            request.Title,
            request.Description,
            request.Priority,
            request.DueDate,
            userId);

        var result = await _mediator.Send(command);

        return Ok(result);
    }

    [HttpPut("{taskId}")]
    public async Task<IActionResult> Update(Guid taskId, [FromBody] UpdateTaskRequest request)
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdString, out var userId))
        {
            return Unauthorized();
        }

        var command = new UpdateTaskCommand(
            taskId,
            request.EventId,
            request.Title,
            request.Description,
            request.Priority,
            request.DueDate,
            userId);

        var result = await _mediator.Send(command);

        return Ok(result);
    }

    [HttpDelete("{taskId}")]
    public async Task<IActionResult> Delete(Guid taskId, [FromQuery] Guid eventId)
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdString, out var userId))
        {
            return Unauthorized();
        }

        var command = new DeleteTaskCommand(taskId, eventId, userId);
        await _mediator.Send(command);

        return NoContent();
    }

    [HttpPatch("{taskId}/status")]
    public async Task<IActionResult> UpdateStatus(Guid taskId, [FromBody] UpdateTaskStatusRequest request)
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdString, out var userId))
        {
            return Unauthorized();
        }

        if (!Enum.TryParse<TaskStatus>(request.Status, out var status))
        {
            return BadRequest("Invalid status value");
        }

        var command = new UpdateTaskStatusCommand(
            taskId,
            request.EventId,
            status,
            userId);

        var result = await _mediator.Send(command);

        return Ok(result);
    }
}

public record CreateTaskRequest(
    Guid EventId,
    string Title,
    string? Description,
    TaskPriority Priority,
    DateTime? DueDate);

public record UpdateTaskRequest(
    Guid EventId,
    string? Title,
    string? Description,
    TaskPriority? Priority,
    DateTime? DueDate);

public record UpdateTaskStatusRequest(
    Guid EventId,
    string Status);