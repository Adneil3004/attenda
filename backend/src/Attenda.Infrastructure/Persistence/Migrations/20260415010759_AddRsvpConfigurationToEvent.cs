using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Attenda.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddRsvpConfigurationToEvent : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "rsvp_allow_dietary_requirements",
                table: "events",
                type: "boolean",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "rsvp_color_theme",
                table: "events",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "rsvp_header_image_url",
                table: "events",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "rsvp_headline",
                table: "events",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "rsvp_message",
                table: "events",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "rsvp_require_attendance_tracking",
                table: "events",
                type: "boolean",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "rsvp_typography_theme",
                table: "events",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "rsvp_allow_dietary_requirements",
                table: "events");

            migrationBuilder.DropColumn(
                name: "rsvp_color_theme",
                table: "events");

            migrationBuilder.DropColumn(
                name: "rsvp_header_image_url",
                table: "events");

            migrationBuilder.DropColumn(
                name: "rsvp_headline",
                table: "events");

            migrationBuilder.DropColumn(
                name: "rsvp_message",
                table: "events");

            migrationBuilder.DropColumn(
                name: "rsvp_require_attendance_tracking",
                table: "events");

            migrationBuilder.DropColumn(
                name: "rsvp_typography_theme",
                table: "events");
        }
    }
}
