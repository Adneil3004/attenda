using Attenda.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Attenda.Infrastructure.Persistence.Migrations
{
    public partial class UpdatePaymentPackagesMXN : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // 1. Update existing packages to MXN and new limits/prices
            migrationBuilder.Sql("UPDATE payment_packages SET currency = 'MXN', updated_at = NOW();");
            
            // Free: 40 guests, $0
            migrationBuilder.Sql("UPDATE payment_packages SET name = 'Free', description = 'Plan básico para eventos pequeños con hasta 40 invitados', guest_count = 40, price = 0.00 WHERE type = 'free';");
            
            // Standard: 150 guests, $1600
            migrationBuilder.Sql("UPDATE payment_packages SET name = 'Standard', description = 'Plan ideal para eventos medianos con hasta 150 invitados', guest_count = 150, price = 1600.00 WHERE type = 'standard';");
            
            // Premium: 250 guests, $2100
            migrationBuilder.Sql("UPDATE payment_packages SET name = 'Premium', description = 'Plan profesional para eventos grandes con hasta 250 invitados', guest_count = 250, price = 2100.00 WHERE type = 'premium';");
            
            // Planner: Update currency and price (optional but good for consistency)
            migrationBuilder.Sql("UPDATE payment_packages SET price = 4999.00 WHERE type = 'planner';");

            // 2. Insert the NEW Elite plan
            migrationBuilder.Sql(@"
                INSERT INTO payment_packages (id, name, type, description, guest_count, price, currency, is_active, has_discount, discount_percentage, features, created_at, updated_at)
                VALUES 
                (gen_random_uuid(), 'Elite', 'elite', 'Plan exclusivo para grandes celebraciones con hasta 500 invitados', 500, 2900.00, 'MXN', true, false, 0, '{""seats"": 500, ""events_per_month"": 10, ""guest_management"": true, ""table_layout"": true, ""task_management"": true, ""priority_support"": true}', NOW(), NOW())
            ");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DELETE FROM payment_packages WHERE type = 'elite';");
            migrationBuilder.Sql("UPDATE payment_packages SET currency = 'USD' WHERE type IN ('free', 'standard', 'premium', 'planner');");
        }
    }
}
