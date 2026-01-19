# Étape 1 : Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# 1. On spécifie le chemin complet depuis la racine du dépôt
# On copie le fichier .csproj vers le dossier de travail interne /src/
COPY ["backend/backend/backend.csproj", "backend/backend/"]

# 2. On restaure en pointant vers le fichier copié
RUN dotnet restore "backend/backend/backend.csproj"

# 3. On copie tout le contenu du dépôt dans /src
COPY . .

# 4. On se place là où se trouve le projet pour la publication
WORKDIR "/src/backend/backend"
RUN dotnet publish "backend.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Étape 2 : Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:10000
EXPOSE 10000

ENTRYPOINT ["dotnet", "backend.dll"]