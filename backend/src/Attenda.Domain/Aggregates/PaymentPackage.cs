using Attenda.Domain.Common;

namespace Attenda.Domain.Aggregates;

public class PaymentPackage : Entity
{
    public string Name { get; private set; }
    public string Type { get; private set; }
    public string? Description { get; private set; }
    public int GuestCount { get; private set; }
    public decimal Price { get; private set; }
    public string Currency { get; private set; }
    public bool IsActive { get; private set; }
    public bool HasDiscount { get; private set; }
    public int DiscountPercentage { get; private set; }
    public string? DiscountCode { get; private set; }
    public string? Features { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime UpdatedAt { get; private set; }

    private PaymentPackage() { }

    public static PaymentPackage Create(
        string name,
        string type,
        int guestCount,
        decimal price,
        string currency = "USD",
        string? description = null,
        bool hasDiscount = false,
        int discountPercentage = 0,
        string? discountCode = null,
        string? features = null)
    {
        return new PaymentPackage
        {
            Id = Guid.NewGuid(),
            Name = name,
            Type = type,
            Description = description,
            GuestCount = guestCount,
            Price = price,
            Currency = currency,
            IsActive = true,
            HasDiscount = hasDiscount,
            DiscountPercentage = discountPercentage,
            DiscountCode = discountCode,
            Features = features,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
    }

    public void Update(
        string? name = null,
        string? type = null,
        string? description = null,
        int? guestCount = null,
        decimal? price = null,
        string? currency = null,
        bool? isActive = null,
        bool? hasDiscount = null,
        int? discountPercentage = null,
        string? discountCode = null,
        string? features = null)
    {
        if (name != null) Name = name;
        if (type != null) Type = type;
        if (description != null) Description = description;
        if (guestCount.HasValue) GuestCount = guestCount.Value;
        if (price.HasValue) Price = price.Value;
        if (currency != null) Currency = currency;
        if (isActive.HasValue) IsActive = isActive.Value;
        if (hasDiscount.HasValue) HasDiscount = hasDiscount.Value;
        if (discountPercentage.HasValue) DiscountPercentage = discountPercentage.Value;
        if (discountCode != null) DiscountCode = discountCode;
        if (features != null) Features = features;
        UpdatedAt = DateTime.UtcNow;
    }
}
