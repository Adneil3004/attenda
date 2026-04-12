using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Attenda.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class LookupsController : ControllerBase
{
    [HttpGet("event-types")]
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
}
