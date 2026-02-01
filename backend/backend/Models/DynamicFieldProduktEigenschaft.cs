namespace backend.Models
{
public class DynamicFieldProduktEigenschaft
{
    public int Id { get; set; }
    public string Label { get; set; } = string.Empty;
    public string Hinweis { get; set; } = string.Empty;
    public string Type { get; set; } = "text"; // "text", "number", "select", "checkbox"
    public bool IsRequired { get; set; }
    
    // Pour les menus déroulants : "Option 1, Option 2, Option 3"
    public string? Options { get; set; } 
}
}