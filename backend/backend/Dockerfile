FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Docker cherche maintenant "backend.csproj" dans le même dossier que ce Dockerfile
COPY ["backend.csproj", "./backend/backend"]
RUN dotnet restore "backend.csproj"

# Copie le reste du code (Controllers, Program.cs, etc.)
COPY . .
RUN dotnet publish "backend.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

# Port standard pour Render
ENV ASPNETCORE_URLS=http://+:10000
EXPOSE 10000

ENTRYPOINT ["dotnet", "backend.dll"]