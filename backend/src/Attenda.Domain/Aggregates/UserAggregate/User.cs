using Attenda.Domain.Common;
using Attenda.Domain.ValueObjects;

namespace Attenda.Domain.Aggregates.UserAggregate;

public class User : AggregateRoot
{
    public string FullName { get; private set; }
    public EmailAddress Email { get; private set; }
    public string PasswordHash { get; private set; } // Local JWT auth for MVP
    public DateTime CreatedAt { get; private set; }

    private readonly List<PaymentMethod> _paymentMethods = new();
    public IReadOnlyCollection<PaymentMethod> PaymentMethods => _paymentMethods.AsReadOnly();

    private User() : base() { FullName = null!; Email = null!; PasswordHash = null!; } // EF Core

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

    /// <summary>
    /// Registers a tokenized payment method for this organizer.
    /// The first card added is automatically set as the default.
    /// Duplicate tokens are silently ignored to ensure idempotency.
    /// </summary>
    /// <param name="providerToken">Opaque token from the payment provider (e.g. Stripe pm_xxx). Never the raw PAN.</param>
    /// <param name="last4">Last 4 digits — safe for display only.</param>
    /// <param name="brand">Card brand (Visa, Mastercard, etc.).</param>
    public PaymentMethod AddPaymentMethod(string providerToken, string last4, string brand)
    {
        if (string.IsNullOrWhiteSpace(providerToken))
            throw new ArgumentException("Provider token cannot be empty.", nameof(providerToken));

        if (last4.Length != 4 || !last4.All(char.IsDigit))
            throw new ArgumentException("Last4 must be exactly 4 digits.", nameof(last4));

        // Idempotency: same token already registered → return existing
        var existing = _paymentMethods.FirstOrDefault(pm => pm.ProviderToken == providerToken);
        if (existing is not null)
            return existing;

        // First card becomes the default automatically
        var isDefault = _paymentMethods.Count == 0;
        var paymentMethod = PaymentMethod.Create(Id, providerToken, last4, brand, isDefault);
        _paymentMethods.Add(paymentMethod);
        return paymentMethod;
    }
}
