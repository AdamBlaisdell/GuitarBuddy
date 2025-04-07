namespace GuitarBuddy.Server.Models
{
    public class Scale
    {
        public string Root { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty; // e.g., "Major"
        public List<string> Notes { get; set; } = new();
    }
}
