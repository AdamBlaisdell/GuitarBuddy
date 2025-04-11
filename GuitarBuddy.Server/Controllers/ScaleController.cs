using GuitarBuddy.Server.Models;
using Microsoft.AspNetCore.Mvc;
using System.Text.RegularExpressions;

[ApiController]
[Route("[controller]")]
public class ScaleController : ControllerBase
{

    // The musical alphabet, not including sharps and flats.
    static List<string> alphabet = new List<string> { "C", "D", "E", "F", "G", "A", "B" };

    // The twelve notes in Western music, with their enharmonic equivalents on the left and right.
    static List<List<string>> notes = new List<List<string>>
    {
        new List<string> { "B#", "C", "Dbb" },
        new List<string> { "B##", "C#", "Db" },
        new List<string> { "C##", "D", "Ebb" },
        new List<string> { "D#", "Eb", "Fbb" },
        new List<string> { "D##", "E", "Fb" },
        new List<string> { "E#", "F", "Gbb" },
        new List<string> { "E##", "F#", "Gb" },
        new List<string> { "F##", "G", "Abb" },
        new List<string> { "G#", "Ab" }, // Would have triple flat or sharp both ways, look at a piano.
        new List<string> { "G##", "A", "Bbb" },
        new List<string> { "A#", "Bb", "Cbb" },
        new List<string> { "A##", "B", "Cb" },
    };

    // Scale interval formulas.
    static Dictionary<string, string> scales = new Dictionary<string, string>
    {
        { "chromatic",        "1,b2,2,b3,3,4,b5,5,b6,6,b7,7" },
        { "major",            "1,2,3,4,5,6,7" },
        { "minor",            "1,2,b3,4,5,b6,b7" },
        { "melodic_minor",    "1,2,b3,4,5,6,7" },
        { "harmonic_minor",   "1,2,b3,4,5,b6,7" },
        { "major_blues",      "1,2,b3,3,5,6" },
        { "minor_blues",      "1,b3,4,b5,5,b7" },
        { "pentatonic_major", "1,2,3,5,6" },
        { "pentatonic_minor", "1,b3,4,5,b7" },
        { "pentatonic_blues", "1,b3,4,b5,5,b7" },
    };

    // Alternative names for intervals.
    static List<List<string>> intervals_major = new List<List<string>>
    {
        new List<string>{ "1", "bb2" },
        new List<string>{ "b2", "#1" },
        new List<string>{ "2", "bb3", "9" },
        new List<string>{ "b3", "#2" },
        new List<string>{ "3", "b4" },
        new List<string>{ "4", "#3", "11" },
        new List<string>{ "b5", "#4", "#11" },
        new List<string>{ "5", "bb6" },
        new List<string>{ "b6", "#5" },
        new List<string>{ "6", "bb7", "13" },
        new List<string>{ "b7", "#6" },
        new List<string>{ "7", "b8" },
        new List<string>{ "8", "#7" },
    };



    // Returns the index of the list where the search note is found. 
    static int FindNoteIndex(string searchNote)
    {
        for (int i = 0; i < notes.Count; i++)
        {
            if (notes[i].Contains(searchNote))
                return i;
        }
        return -1;
    }

    // Re-orders the list so that the list with the search note is in front.
    // Skips over N elements and then appends them to the end of the list. 
    static List<List<string>> Rotate(List<List<string>> list, int n)
    {
        return list.Skip(n).Concat(list.Take(n)).ToList();
    }

    static List<string> Rotate(List<string> list, int n)
    {
        return list.Skip(n).Concat(list.Take(n)).ToList();
    }

    // Finds the root note index and rotates to put it in front using FindNoteIndex and Rotate. 
    static List<List<string>> Chromatic(string key)
    {
        int index = FindNoteIndex(key);
        return Rotate(notes, index);
    }

    // Returns the list of intervals and corresponding notes. 
    static Dictionary<string, string> MakeIntervalsMajor(string key)
    {
        var result = new Dictionary<string, string>();
        var chrom = Chromatic(key);  // Generate the chromatic scale based on the root note
        int alphaStart = alphabet.IndexOf(key[0].ToString());  // Find the root note's index in the alphabet
        var rotatedAlpha = Rotate(alphabet, alphaStart);  // Rotate the alphabet so the root note comes first

        for (int i = 0; i < intervals_major.Count; i++)
        {
            foreach (var name in intervals_major[i])  // Loop through each interval name in intervals_major
            {
                int intervalIndex = int.Parse(Regex.Replace(name, "[b#]", "")) - 1;  // Remove accidentals (e.g., b, #) and convert to index
                string noteAlpha = rotatedAlpha[intervalIndex % rotatedAlpha.Count];  // Get the note based on the rotated alphabet
                var enharmonics = chrom[i % chrom.Count];  // Get the enharmonic notes for the interval

                string match = enharmonics.FirstOrDefault(n => n.StartsWith(noteAlpha));  // Find the correct enharmonic note
                result[name] = match ?? enharmonics[0];  // If no match is found, use the first enharmonic
            }
        }

        return result;  // Return the final dictionary of intervals and their corresponding notes
    }

    [HttpGet]
public IActionResult GetScale([FromQuery] string root, [FromQuery] string scale)
{
    // Ensure the root note and scale type are provided
    if (string.IsNullOrWhiteSpace(root) || string.IsNullOrWhiteSpace(scale))
    {
        return BadRequest("Missing root note or scale type.");
    }

    // Determine the interval formula based on the selected scale type
    string intervalFormula = scales.ContainsKey(scale.ToLower()) ? scales[scale.ToLower()] : null;

    if (intervalFormula == null)
    {
        return BadRequest("Unsupported scale type.");
    }

    // Generate the intervals for the scale (this is where the 'MakeIntervalsMajor' or similar methods come in)
    var intervals = MakeIntervalsMajor(root);  // For major scales
    var intervalSymbols = intervalFormula.Split(',');  // Break the formula into symbols (like "1", "2", etc.)

    var scaleNotes = intervalSymbols.Select(x => intervals[x.Trim()]).ToList();

        // Return the notes as an object with the root, name, and notes
    Scale scaleResponse = new Scale()
    {
        Root = root,
        Name = scale, // You can modify this to return a more user-friendly scale name
        Notes = scaleNotes
    };

    return Ok(scaleResponse);  // Return the scale response with notes
}

}