using System.Text.RegularExpressions;
using Attenda.Domain.Common;

namespace Attenda.Domain.ValueObjects;

public class EmailAddress : ValueObject
{
    private static readonly Regex EmailRegex = new(
        @"^[^@\s]+@[^@\s]+\.[^@\s]+$",
        RegexOptions.Compiled | RegexOptions.IgnoreCase);

    public string Value { get; }

    private EmailAddress(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
            throw new ArgumentException("Email address cannot be empty.", nameof(value));

        if (!EmailRegex.IsMatch(value))
            throw new ArgumentException("Invalid email address format.", nameof(value));

        Value = value.ToLowerInvariant();
    }

    public static EmailAddress Create(string value) => new(value);

    protected override IEnumerable<object?> GetEqualityComponents()
    {
        yield return Value;
    }

    public override string ToString() => Value;
}
