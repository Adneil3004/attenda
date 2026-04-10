using Attenda.Domain.Common;
using Attenda.Domain.ValueObjects;

namespace Attenda.Domain.Aggregates.UserAggregate;

public class User : AggregateRoot
{
    public string FullName { get; private set; }
    public EmailAddress Email { get; private set; }
    public string PasswordHash { get; private set; } // Local JWT auth for MVP
    public DateTime CreatedAt { get; private set; }

    private User(string fullName, EmailAddress email, string passwordHash) : base()
    {
        FullName = fullName;
        Email = email;
        PasswordHash = passwordHash;
        CreatedAt = DateTime.UtcNow;
    }

    public static User Create(string fullName, EmailAddress email, string passwordHash)
        => new(fullName, email, passwordHash);

    public void UpdateProfile(string fullName)
    {
        FullName = fullName;
    }

    public void ChangePassword(string newPasswordHash)
    {
        PasswordHash = newPasswordHash;
    }
}
