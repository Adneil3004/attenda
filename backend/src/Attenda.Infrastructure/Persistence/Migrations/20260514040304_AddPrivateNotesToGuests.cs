using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Attenda.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddPrivateNotesToGuests : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
                ALTER TABLE guests
                ADD COLUMN private_notes TEXT;
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("ALTER TABLE guests DROP COLUMN private_notes;");
        }
    }
}
