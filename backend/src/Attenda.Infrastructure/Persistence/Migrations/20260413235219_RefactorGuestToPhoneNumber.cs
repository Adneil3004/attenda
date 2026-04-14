using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Attenda.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class RefactorGuestToPhoneNumber : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_guests_table_table_id",
                table: "guests");

            migrationBuilder.DropColumn(
                name: "plus_one",
                table: "guests");

            migrationBuilder.RenameColumn(
                name: "email",
                table: "guests",
                newName: "phone_number");

            // Index doesn't exist in actual DB, skip rename
            // migrationBuilder.RenameIndex(
            //     name: "ix_guests_event_id_email",
            //     table: "guests",
            //     newName: "ix_guests_event_id_phone_number");

            migrationBuilder.AddForeignKey(
                name: "fk_guests_tables_table_id",
                table: "guests",
                column: "table_id",
                principalTable: "tables",
                principalColumn: "id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_guests_tables_table_id",
                table: "guests");

            migrationBuilder.RenameColumn(
                name: "phone_number",
                table: "guests",
                newName: "email");

            // Index doesn't exist in actual DB
            // migrationBuilder.RenameIndex(
            //     name: "ix_guests_event_id_phone_number",
            //     table: "guests",
            //     newName: "ix_guests_event_id_email");

            migrationBuilder.AddColumn<bool>(
                name: "plus_one",
                table: "guests",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddForeignKey(
                name: "fk_guests_table_table_id",
                table: "guests",
                column: "table_id",
                principalTable: "tables",
                principalColumn: "id",
                onDelete: ReferentialAction.SetNull);
        }
    }
}
