using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Attenda.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class FixPremiumGuestCountAnyCase : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Update any case variation of "premium" to have 999 guests
            migrationBuilder.Sql(@"
                UPDATE payment_packages
                SET guest_count = 999, updated_at = NOW()
                WHERE LOWER(type) = 'premium';
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Revert to previous values (will restore based on original seed values)
            migrationBuilder.Sql(@"
                UPDATE payment_packages
                SET guest_count = 200, updated_at = NOW()
                WHERE LOWER(type) = 'premium';
            ");
        }
    }
}
