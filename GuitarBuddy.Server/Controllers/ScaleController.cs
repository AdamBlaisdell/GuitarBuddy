using GuitarBuddy.Server.Models;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("[controller]")]
public class ScaleController : ControllerBase
{
    [HttpGet]
    public IActionResult GetScale([FromQuery] string? root)
    {
        if (string.IsNullOrWhiteSpace(root))
        {
            return BadRequest("Missing root note.");
        }

        string scaleRoot = root.Trim().ToUpper();

        var scale = new Scale
        {
            Root = scaleRoot,
            Name = "Major"
        };

        scale.Notes = scaleRoot switch
        {
            "G" => new List<string> { "G", "A", "B", "C", "D", "E", "F#" },
            "A" => new List<string> { "A", "B", "C#", "D", "E", "F#", "G#" },
            _ => null
        };

        if (scale.Notes == null)
            return BadRequest("Unsupported root note. Only G and A major are supported.");

        return Ok(scale);
    }
}
