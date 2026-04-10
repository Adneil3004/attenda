using Attenda.Domain.Aggregates.UserAggregate;
using Attenda.Domain.Interfaces;
using Attenda.Domain.ValueObjects;
using Microsoft.EntityFrameworkCore;

namespace Attenda.Infrastructure.Persistence.Repositories;

public class UserRepository : IUserRepository
{
    private readonly AppDbContext _context;

    public UserRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<User?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Users.FirstOrDefaultAsync(u => u.Id == id, cancellationToken);
    }

    public async Task<User?> GetByEmailAsync(EmailAddress email, CancellationToken cancellationToken = default)
    {
        return await _context.Users.FirstOrDefaultAsync(u => u.Email == email, cancellationToken);
    }

    public void Add(User user) => _context.Users.Add(user);

    public void Update(User user) => _context.Users.Update(user);
}
