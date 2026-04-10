using Attenda.Application;
using Attenda.Application.Common.Interfaces;
using Attenda.Domain.Interfaces;
using Attenda.Infrastructure.Persistence;
using Attenda.Infrastructure.Persistence.Repositories;
using Attenda.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Attenda.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("DefaultConnection");

        services.AddDbContext<AppDbContext>(options =>
            options.UseNpgsql(connectionString));

        services.AddScoped<IUnitOfWork>(sp => sp.GetRequiredService<AppDbContext>());
        services.AddScoped<IEventRepository, EventRepository>();
        services.AddScoped<IUserRepository, UserRepository>();

        services.AddScoped<IJwtTokenService, JwtTokenService>();
        services.AddScoped<IQrCodeService, QrCodeService>();

        return services;
    }
}
