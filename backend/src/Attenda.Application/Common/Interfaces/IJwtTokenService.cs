using Attenda.Domain.Aggregates.UserAggregate;

namespace Attenda.Application.Common.Interfaces;

public interface IJwtTokenService
{
    string GenerateToken(User user);
}
