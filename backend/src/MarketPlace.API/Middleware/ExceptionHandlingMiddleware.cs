using System.Net;
using System.Text.Json;
using MarketPlace.Application.Common.Exceptions;

namespace MarketPlace.API.Middleware;

/// <summary>
/// Servislarda tashlangan (thrown) exception'larni mos HTTP status code'larga aylantiradi,
/// shunda controller'larda try/catch yozishning hojati qolmaydi.
/// </summary>
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
            var statusCode = ex switch
            {
                NotFoundException => HttpStatusCode.NotFound,
                BadRequestException => HttpStatusCode.BadRequest,
                UnauthorizedAppException => HttpStatusCode.Unauthorized,
                _ => HttpStatusCode.InternalServerError,
            };

            if (statusCode == HttpStatusCode.InternalServerError)
            {
                _logger.LogError(ex, "Kutilmagan xatolik yuz berdi");
            }

            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)statusCode;

            var message = statusCode == HttpStatusCode.InternalServerError
                ? "Ichki server xatoligi."
                : ex.Message;

            await context.Response.WriteAsync(JsonSerializer.Serialize(new { message }));
        }
    }
}

public static class ExceptionHandlingMiddlewareExtensions
{
    public static IApplicationBuilder UseExceptionHandlingMiddleware(this IApplicationBuilder app)
        => app.UseMiddleware<ExceptionHandlingMiddleware>();
}
