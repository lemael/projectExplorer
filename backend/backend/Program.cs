var builder = WebApplication.CreateBuilder(args);

// 1. AJOUT : Permet d'utiliser les fichiers dans le dossier /Controllers
builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// 2. AJOUT : Configuration du CORS mise à jour avec l'URL Render
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
                "http://localhost:3000", 
                "http://localhost:5173", 
                "https://jopke-backend.onrender.com" // Votre URL Render
              ) 
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
// NOTE : J'ai sorti Swagger du bloc IsDevelopment pour que vous puissiez 
// voir l'interface de test sur Render (très utile pour débugger au début)
app.UseSwagger();
app.UseSwaggerUI();

// 3. AJOUT : Activer le CORS avant les autres middlewares
app.UseCors("AllowFrontend");

// Optionnel : Render gère déjà le HTTPS, mais c'est une bonne pratique
app.UseHttpsRedirection();

// 4. AJOUT : Mappe les routes des contrôleurs
app.MapControllers();

var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/weatherforecast", () =>
{
    var forecast =  Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();
    return forecast;
})
.WithName("GetWeatherForecast")
.WithOpenApi();

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}

