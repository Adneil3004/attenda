using Attenda.Domain.Common;

namespace Attenda.Domain.Aggregates.UserAggregate;

/// <summary>
/// Represents a tokenized payment method belonging to an organizer.
/// We NEVER store raw card numbers (PAN) or CVV codes — only the
/// provider-issued token and safe display metadata.
/// </summary>
public class PaymentMethod : Entity
{
    /// <summary>Token issued by the payment provider (e.g. Stripe pm_xxx).</summary>
    public string ProviderToken { get; private set; }

    /// <summary>Last 4 digits of the card — safe to display in the UI.</summary>
    public string Last4 { get; private set; }

    /// <summary>Card brand (e.g. Visa, Mastercard, Amex).</summary>
    public string Brand { get; private set; }

    /// <summary>Whether this is the organizer's default card.</summary>
    public bool IsDefault { get; private set; }

    public DateTime CreatedAt { get; private set; }

    /// <summary>Foreign key back to the owning User aggregate.</summary>
    public Guid UserId { get; private set; }

    private PaymentMethod() : base() { ProviderToken = null!; Last4 = null!; Brand = null!; } // EF Core

    private PaymentMethod(Guid userId, string providerToken, string last4, string brand, bool isDefault) : base()
    {
        UserId = userId;
        ProviderToken = providerToken;
        Last4 = last4;
        Brand = brand;
        IsDefault = isDefault;
        CreatedAt = DateTime.UtcNow;
    }

    internal static PaymentMethod Create(Guid userId, string providerToken, string last4, string brand, bool isDefault)
        => new(userId, providerToken, last4, brand, isDefault);

    internal void SetAsDefault() => IsDefault = true;
    internal void UnsetDefault() => IsDefault = false;
}
