using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Attenda.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class CreateEventRsvpConfigsTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "event_rsvp_configs",
                columns: table => new
                {
                    event_id = table.Column<Guid>(type: "uuid", nullable: false),
                    headline = table.Column<string>(type: "text", nullable: true),
                    message = table.Column<string>(type: "text", nullable: true),
                    header_image_url = table.Column<string>(type: "text", nullable: true),
                    require_attendance_tracking = table.Column<bool>(type: "boolean", nullable: false),
                    allow_dietary_requirements = table.Column<bool>(type: "boolean", nullable: false),
                    typography_theme = table.Column<string>(type: "text", nullable: true),
                    color_theme = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_event_rsvp_configs", x => x.event_id);
                    table.ForeignKey(
                        name: "fk_event_rsvp_configs_events_event_id",
                        column: x => x.event_id,
                        principalTable: "events",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(name: "event_rsvp_configs");
        }
    }
}
