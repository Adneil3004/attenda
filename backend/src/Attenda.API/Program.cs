using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.IdentityModel.Logging;
using System.Text;
using Attenda.Application;
using Attenda.Infrastructure;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Serilog;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Enable detailed auth errors for debugging
IdentityModelEventSource.ShowPII = true;

// Serilog
Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .CreateLogger();

builder.Host.UseSerilog();

// Add layers
builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter());
        options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
    });
builder.Services.AddEndpointsApiExplorer();

// Swagger
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Attenda API", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
            },
            Array.Empty<string>()
        }
    });
});

// Auth - Supabase Configuration (ES256)
var supabaseUrl = builder.Configuration["Supabase:Url"] ?? "";
var supabaseAuthority = $"{supabaseUrl}/auth/v1";

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        // NO Authority/MetadataAddress — el discovery automático interfiere con la clave manual
        // y produce IDX10500 al reemplazar (o no setear) IssuerSigningKeys.
        options.IncludeErrorDetails = true;
        
        // Clave pública ES256 de Supabase (JWKS: pfrblrqwxxjqvzfiftei.supabase.co)
        var x = "RrrhRCKE2gPKeckYBHYwwBiSymgfhPmXjn2UiGZL3BQ";
        var y = "3WwXWUTgqBYtMKPK31mt86JuItSYEt8foeMre16eZK8";
        var ecKey = new ECDsaSecurityKey(
            System.Security.Cryptography.ECDsa.Create(
                new System.Security.Cryptography.ECParameters
                {
                    Curve = System.Security.Cryptography.ECCurve.NamedCurves.nistP256,
                    Q = new System.Security.Cryptography.ECPoint
                    {
                        X = Microsoft.IdentityModel.Tokens.Base64UrlEncoder.DecodeBytes(x),
                        Y = Microsoft.IdentityModel.Tokens.Base64UrlEncoder.DecodeBytes(y)
                    }
                }))
        { KeyId = "cfee8468-d599-437e-bf47-1ba4e79f07e7" };

        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = supabaseAuthority,
            ValidateAudience = true,
            ValidAudience = "authenticated",
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = ecKey,
            NameClaimType = ClaimTypes.NameIdentifier,
            RoleClaimType = "role",
            ClockSkew = TimeSpan.FromMinutes(5)
        };

        options.Events = new JwtBearerEvents
        {
            OnAuthenticationFailed = context =>
            {
                Console.WriteLine($"[AUTH FAILED] {context.Exception.GetType().Name}: {context.Exception.Message}");
                return Task.CompletedTask;
            },
            OnTokenValidated = context =>
            {
                if (context.Principal?.Identity is ClaimsIdentity identity)
                {
                    var subClaim = identity.FindFirst("sub");
                    if (subClaim != null)
                        identity.AddClaim(new Claim(ClaimTypes.NameIdentifier, subClaim.Value));
                }
                Console.WriteLine("[AUTH SUCCESS] Token validated successfully.");
                return Task.CompletedTask;
            }
        };
    });

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        // Vite puede arrancar en cualquier puerto libre (5173, 5174, 5175…)
        // Usamos SetIsOriginAllowed para cubrir todos los puertos de localhost sin
        // tener que actualizar esta lista cada vez. En producción solo se permite
        // el dominio exacto de GitHub Pages.
        policy.SetIsOriginAllowed(origin =>
        {
            if (string.IsNullOrWhiteSpace(origin)) return false;
            var uri = new Uri(origin);
            if (uri.Host is "localhost" or "127.0.0.1") return true;
            return origin.Equals("https://adneil3004.github.io", StringComparison.OrdinalIgnoreCase);
        })
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials();
    });
});

// Configure Forwarded Headers to handle HTTPS behind proxy (Render)
builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
    options.KnownNetworks.Clear();
    options.KnownProxies.Clear();
});

var app = builder.Build();

app.UseForwardedHeaders();
app.UseCors("AllowAll");

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Welcome Endpoint
app.MapGet("/", () => Results.Ok(new { message = "Attenda API is running 🚀", environment = app.Environment.EnvironmentName, version = "1.0.0" }));

// Health Check Endpoint
app.MapGet("/health", async (Attenda.Infrastructure.Persistence.AppDbContext context) => 
{
    try 
    {
        var canConnect = await context.Database.CanConnectAsync();
        return Results.Ok(new { status = "Healthy", database = canConnect ? "Connected" : "Disconnected" });
    }
    catch (Exception ex)
    {
        return Results.Problem(detail: ex.Message, title: "Unhealthy");
    }
});

app.UseStaticFiles();
app.UseAuthentication();
app.UseAuthorization();

// ── Migration & Diagnostic Helper ──
using (var scope = app.Services.CreateScope())
{
    var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
    var context = scope.ServiceProvider.GetRequiredService<Attenda.Infrastructure.Persistence.AppDbContext>();
    
    try 
    {
        logger.LogInformation("Checking database connectivity and migrations...");
        
        var pendingMigrations = (await context.Database.GetPendingMigrationsAsync()).ToList();
        var appliedMigrations = (await context.Database.GetAppliedMigrationsAsync()).ToList();
        
        logger.LogInformation("Applied migrations: {AppliedCount}", appliedMigrations.Count);
        
        if (pendingMigrations.Any())
        {
            logger.LogInformation("Pending migrations found: {PendingMigrations}", string.Join(", ", pendingMigrations));
            logger.LogInformation("Applying migrations now...");
            try 
            {
                await context.Database.MigrateAsync();
                logger.LogInformation("Migrations applied successfully.");
            }
            catch (Exception migEx)
            {
                logger.LogError(migEx, "CRITICAL: Failed to apply migrations. Check if the database is in a partial state.");
                // If it fails, we might want to know if 'users' table exists at all
                try {
                    var tableExists = await context.Database.ExecuteSqlRawAsync("SELECT to_regclass('public.users') IS NOT NULL;");
                    logger.LogWarning("Diagnostic: 'users' table registration check returned successfully.");
                } catch {
                    logger.LogError("Diagnostic: Failed to even check if 'users' table exists.");
                }
            }
        }
        else
        {
            logger.LogInformation("No pending migrations found.");
        }
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "An error occurred during database migration or connectivity check.");
    }
}

app.MapControllers();

app.Run();
