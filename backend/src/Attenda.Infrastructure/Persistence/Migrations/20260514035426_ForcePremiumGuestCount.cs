using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Attenda.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class ForcePremiumGuestCount : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Force update ALL rows where type contains 'premium' (any case)
            migrationBuilder.Sql(@"
                UPDATE payment_packages
                SET guest_count = 999, updated_at = NOW()
                WHERE LOWER(type) LIKE '%premium%';
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
                UPDATE payment_packages
                SET guest_count = 200, updated_at = NOW()
                WHERE LOWER(type) LIKE '%premium%';
            ");
        }
    }
}
