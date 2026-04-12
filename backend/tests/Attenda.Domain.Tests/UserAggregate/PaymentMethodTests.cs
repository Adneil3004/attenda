using Attenda.Domain.Aggregates.UserAggregate;
using Attenda.Domain.ValueObjects;

namespace Attenda.Domain.Tests.UserAggregate;

public class PaymentMethodTests
{
    private static User CreateTestUser()
        => User.Create("Test Organizer", EmailAddress.Create("organizer@test.com"), "hashed");

    // --- AddPaymentMethod: Happy Path ---

    [Fact]
    public void AddPaymentMethod_FirstCard_ShouldBeSetAsDefault()
    {
        var user = CreateTestUser();

        var pm = user.AddPaymentMethod("pm_stripe_123", "4242", "Visa");

        Assert.True(pm.IsDefault);
    }

    [Fact]
    public void AddPaymentMethod_SecondCard_ShouldNotOverrideDefault()
    {
        var user = CreateTestUser();
        user.AddPaymentMethod("pm_stripe_001", "4242", "Visa");

        var second = user.AddPaymentMethod("pm_stripe_002", "1234", "Mastercard");

        Assert.False(second.IsDefault);
        Assert.Equal(2, user.PaymentMethods.Count);
    }

    [Fact]
    public void AddPaymentMethod_SameToken_ShouldReturnExistingAndNotDuplicate()
    {
        var user = CreateTestUser();
        var first = user.AddPaymentMethod("pm_stripe_abc", "9999", "Amex");

        var second = user.AddPaymentMethod("pm_stripe_abc", "9999", "Amex");

        Assert.Equal(first.Id, second.Id);
        Assert.Single(user.PaymentMethods);
    }

    [Fact]
    public void AddPaymentMethod_SetsCorrectMetadata()
    {
        var user = CreateTestUser();

        var pm = user.AddPaymentMethod("pm_token_xyz", "5678", "Mastercard");

        Assert.Equal("pm_token_xyz", pm.ProviderToken);
        Assert.Equal("5678", pm.Last4);
        Assert.Equal("Mastercard", pm.Brand);
        Assert.Equal(user.Id, pm.UserId);
    }

    // --- AddPaymentMethod: Guard Clauses ---

    [Theory]
    [InlineData("")]
    [InlineData(" ")]
    [InlineData(null!)]
    public void AddPaymentMethod_EmptyToken_ShouldThrow(string? token)
    {
        var user = CreateTestUser();

        Assert.Throws<ArgumentException>(() => user.AddPaymentMethod(token!, "1234", "Visa"));
    }

    [Theory]
    [InlineData("123")]      // Too short
    [InlineData("12345")]    // Too long
    [InlineData("12ab")]     // Non-digits
    [InlineData("")]         // Empty
    public void AddPaymentMethod_InvalidLast4_ShouldThrow(string last4)
    {
        var user = CreateTestUser();

        Assert.Throws<ArgumentException>(() => user.AddPaymentMethod("pm_token", last4, "Visa"));
    }
}
