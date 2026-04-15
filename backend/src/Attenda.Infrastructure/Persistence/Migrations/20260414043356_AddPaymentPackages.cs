using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Attenda.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddPaymentPackages : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "payment_packages",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "gen_random_uuid()"),
                    name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    type = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    description = table.Column<string>(type: "text", nullable: true),
                    guest_count = table.Column<int>(type: "integer", nullable: false),
                    price = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false),
                    currency = table.Column<string>(type: "character varying(3)", maxLength: 3, nullable: false, defaultValueSql: "'USD'"),
                    is_active = table.Column<bool>(type: "boolean", nullable: false, defaultValueSql: "true"),
                    has_discount = table.Column<bool>(type: "boolean", nullable: false, defaultValueSql: "false"),
                    discount_percentage = table.Column<int>(type: "integer", nullable: false, defaultValueSql: "0"),
                    discount_code = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    features = table.Column<string>(type: "jsonb", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "NOW()"),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "NOW()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_payment_packages", x => x.id);
                });

            migrationBuilder.CreateIndex(
                name: "ix_payment_packages_type",
                table: "payment_packages",
                column: "type");

            migrationBuilder.CreateIndex(
                name: "ix_payment_packages_is_active",
                table: "payment_packages",
                column: "is_active");

            // Seed data
            migrationBuilder.InsertData(
                table: "payment_packages",
                columns: new[] { "id", "name", "type", "description", "guest_count", "price", "currency", "is_active", "has_discount", "discount_percentage", "features" },
                values: new object[,]
                {
                    { Guid.NewGuid(), "Free", "free", "Plan básico para eventos pequeños con hasta 40 invitados", 40, 0.00, "USD", true, false, 0, "{\"seats\": 40, \"events_per_month\": 1, \"guest_management\": true, \"table_layout\": true, \"basic_support\": true}" },
                    { Guid.NewGuid(), "Standard", "standard", "Plan ideal para eventos medianos con hasta 150 invitados", 150, 99.00, "USD", true, false, 0, "{\"seats\": 150, \"events_per_month\": 3, \"guest_management\": true, \"table_layout\": true, \"task_management\": true, \"email_support\": true}" },
                    { Guid.NewGuid(), "Premium", "premium", "Plan profesional para eventos grandes con más de 200 invitados", 200, 199.00, "USD", true, false, 0, "{\"seats\": 999, \"events_per_month\": 10, \"guest_management\": true, \"table_layout\": true, \"task_management\": true, \"vendor_management\": true, \"priority_support\": true, \"analytics\": true}" },
                    { Guid.NewGuid(), "Planner", "planner", "Plan mensual para planner de eventos con eventos ilimitados", 9999, 499.00, "USD", true, false, 0, "{\"seats\": 9999, \"events_per_month\": 999, \"guest_management\": true, \"table_layout\": true, \"task_management\": true, \"vendor_management\": true, \"priority_support\": true, \"analytics\": true, \"white_label\": true, \"api_access\": true, \"dedicated_manager\": true}" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "payment_packages");
        }
    }
}
