using Attenda.Domain.Aggregates.UserAggregate;
using Attenda.Domain.ValueObjects;

namespace Attenda.Domain.Interfaces;

public interface IUserRepository
{
    Task<User?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<User?> GetByEmailAsync(EmailAddress email, CancellationToken cancellationToken = default);
    void Add(User user);
    void Update(User user);
}
