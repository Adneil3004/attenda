using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Attenda.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class UpdatePremiumGuestCount : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
                UPDATE payment_packages
                SET guest_count = 999, updated_at = NOW()
                WHERE type = 'premium';
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
                UPDATE payment_packages
                SET guest_count = 200, updated_at = NOW()
                WHERE type = 'premium';
            ");
        }
    }
}
