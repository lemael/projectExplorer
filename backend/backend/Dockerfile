# Étape 1 : Build (Environnement SDK pour compiler)
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copier le fichier projet et restaurer les packages
COPY ["backend.csproj", "./"]
RUN dotnet restore "backend.csproj"

# Copier tout le reste et compiler en mode Release
COPY . .
RUN dotnet publish "backend.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Étape 2 : Runtime (Image légère pour l'exécution)
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

# Copier les fichiers compilés depuis l'étape de build
COPY --from=build /app/publish .

# Configuration spécifique pour Render
# Render injecte souvent un port via la variable PORT, mais par défaut il attend 10000
ENV ASPNETCORE_URLS=http://+:10000
EXPOSE 10000

ENTRYPOINT ["dotnet", "backend.dll"]