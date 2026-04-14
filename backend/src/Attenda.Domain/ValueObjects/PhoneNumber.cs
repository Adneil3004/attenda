using System.Text.RegularExpressions;
using Attenda.Domain.Common;

namespace Attenda.Domain.ValueObjects;

public class PhoneNumber : ValueObject
{
    private static readonly Regex PhoneRegex = new(
        @"^\+?[\d\s\-()]{7,20}$",
        RegexOptions.Compiled);

    public string Value { get; }

    private PhoneNumber(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
            throw new ArgumentException("Phone number cannot be empty.", nameof(value));

        if (!PhoneRegex.IsMatch(value))
            throw new ArgumentException("Invalid phone number format.", nameof(value));

        Value = value.Trim();
    }

    public static PhoneNumber Create(string value) => new(value);

    protected override IEnumerable<object?> GetEqualityComponents()
    {
        yield return Value;
    }

    public override string ToString() => Value;
}
