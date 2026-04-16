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

// Auth - Switching to JWKS Discovery (RS256)
var supabaseUrl = builder.Configuration["Supabase:Url"] ?? "";

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        var jwtSecret = builder.Configuration["Supabase:JwtSecret"];
        
        options.Authority = $"{supabaseUrl}/auth/v1";
        options.MetadataAddress = $"{supabaseUrl}/auth/v1/.well-known/openid-configuration";
        options.RequireHttpsMetadata = false; 
        options.IncludeErrorDetails = true;
        
        // Manual ES256 Key Fallback (Extracted from https://pfrblrqwxxjqvzfiftei.supabase.co/auth/v1/.well-known/jwks.json)
        var x = "RrrhRCKE2gPKeckYBHYwwBiSymgfhPmXjn2UiGZL3BQ";
        var y = "3WwXWUTgqBYtMKPK31mt86JuItSYEt8foeMre16eZK8";
        var ecKey = new ECDsaSecurityKey(System.Security.Cryptography.ECDsa.Create(new System.Security.Cryptography.ECParameters
        {
            Curve = System.Security.Cryptography.ECCurve.NamedCurves.nistP256,
            Q = new System.Security.Cryptography.ECPoint
            {
                X = Microsoft.IdentityModel.Tokens.Base64UrlEncoder.DecodeBytes(x),
                Y = Microsoft.IdentityModel.Tokens.Base64UrlEncoder.DecodeBytes(y)
            }
        })) { KeyId = "cfee8468-d599-437e-bf47-1ba4e79f07e7" };

        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = $"{supabaseUrl}/auth/v1",
            ValidateAudience = true,
            ValidAudience = "authenticated",
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = ecKey, // Force the ES256 key
            NameClaimType = ClaimTypes.NameIdentifier,
            RoleClaimType = "role",
            ClockSkew = TimeSpan.FromMinutes(5)
        };

        options.Events = new JwtBearerEvents
        {
            OnAuthenticationFailed = context =>
            {
                Console.WriteLine($"[AUTH FAILED] {context.Exception.GetType().Name}: {context.Exception.Message}");
                if (context.Exception.InnerException != null)
                {
                    Console.WriteLine($"[AUTH INNER] {context.Exception.InnerException.Message}");
                }
                return Task.CompletedTask;
            },
            OnTokenValidated = context =>
            {
                if (context.Principal?.Identity is ClaimsIdentity identity)
                {
                    var subClaim = identity.FindFirst("sub");
                    if (subClaim != null)
                    {
                        identity.AddClaim(new Claim(ClaimTypes.NameIdentifier, subClaim.Value));
                    }
                }
                Console.WriteLine("[AUTH SUCCESS] Token validated successfully.");
                return Task.CompletedTask;
            },
            OnForbidden = context => {
                Console.WriteLine("[AUTH FORBIDDEN] User is authenticated but not allowed to access this resource.");
                return Task.CompletedTask;
            }
        };
    });

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
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

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Welcome Endpoint
app.MapGet("/", () => Results.Ok(new { message = "Attenda API is running 🚀", environment = app.Environment.EnvironmentName, version = "1.0.0" }));

app.UseStaticFiles();
app.UseCors("AllowAll");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
