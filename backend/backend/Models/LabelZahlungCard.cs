namespace backend.Models
{
public class ZahlungConfig
{
    public int Id { get; set; }
    public string StandardLabel { get; set; } = "Standard-Preis";
    public string StandardSubline { get; set; } = "Versand-Start: vorauss. {0}"; // {0} sera remplacé par la date
    public string ExpressLabel { get; set; } = "Express-Preis";
    public string ExpressSubline { get; set; } = "Versand-Start: sicher {0}";
    public string FooterNote { get; set; } = "*Bei Datenübergabe vor 11 Uhr";
    public string ButtonText { get; set; } = "UPLOAD & WARENKORB";
}
}