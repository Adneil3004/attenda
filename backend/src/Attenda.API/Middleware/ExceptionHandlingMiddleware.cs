using System.Net;
using System.Text.Json;
using FluentValidation;

namespace Attenda.API.Middleware;

public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(context, ex);
        }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        _logger.LogError(exception, "An unhandled exception has occurred.");

        context.Response.ContentType = "application/json";
        var response = context.Response;

        var result = exception switch
        {
            ValidationException validationException => new
            {
                StatusCode = (int)HttpStatusCode.BadRequest,
                Message = "Validation Error",
                Errors = validationException.Errors.Select(e => e.ErrorMessage)
            },
            InvalidOperationException invalidOpException => new
            {
                StatusCode = (int)HttpStatusCode.BadRequest,
                Message = invalidOpException.Message,
                Errors = (IEnumerable<string>?)null
            },
            KeyNotFoundException => new
            {
                StatusCode = (int)HttpStatusCode.NotFound,
                Message = exception.Message,
                Errors = (IEnumerable<string>?)null
            },
            UnauthorizedAccessException => new
            {
                StatusCode = (int)HttpStatusCode.Unauthorized,
                Message = "Unauthorized access",
                Errors = (IEnumerable<string>?)null
            },
            _ => new
            {
                StatusCode = (int)HttpStatusCode.InternalServerError,
                Message = "Internal Server Error",
                Errors = (IEnumerable<string>?)null
            }
        };

        response.StatusCode = result.StatusCode;
        await response.WriteAsync(JsonSerializer.Serialize(result));
    }
}
