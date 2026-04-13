# Etapa 1: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
# Render usa la variable de entorno PORT. Configuramos .NET para que escuche ahí.
ENV ASPNETCORE_URLS=http://+:${PORT:-8080}
EXPOSE 8080

# Etapa 2: SDK para compilar
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copiamos los archivos de proyecto para restaurar dependencias primero (cache eficiente)
COPY ["src/Attenda.API/Attenda.API.csproj", "src/Attenda.API/"]
COPY ["src/Attenda.Application/Attenda.Application.csproj", "src/Attenda.Application/"]
COPY ["src/Attenda.Domain/Attenda.Domain.csproj", "src/Attenda.Domain/"]
COPY ["src/Attenda.Infrastructure/Attenda.Infrastructure.csproj", "src/Attenda.Infrastructure/"]

RUN dotnet restore "src/Attenda.API/Attenda.API.csproj"

# Copiamos todo el código fuente
COPY . .
WORKDIR "/src/src/Attenda.API"
RUN dotnet build "Attenda.API.csproj" -c Release -o /app/build

# Etapa 3: Publicación
FROM build AS publish
RUN dotnet publish "Attenda.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Etapa 4: Imagen Final
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Attenda.API.dll"]
