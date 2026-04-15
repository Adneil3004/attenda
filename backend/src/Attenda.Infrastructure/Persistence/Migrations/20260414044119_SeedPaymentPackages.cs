using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Attenda.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class SeedPaymentPackages : Migration
    {
        /// <inheritdoc />
protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Delete existing seed data first (idempotent)
            migrationBuilder.Sql("DELETE FROM payment_packages WHERE type IN ('free', 'standard', 'premium', 'planner');");
            
            // Seed data for payment packages
            migrationBuilder.Sql(@"
                INSERT INTO payment_packages (id, name, type, description, guest_count, price, currency, is_active, has_discount, discount_percentage, features, created_at, updated_at)
                VALUES 
                (gen_random_uuid(), 'Free', 'free', 'Plan básico para eventos pequeños con hasta 40 invitados', 40, 0.00, 'USD', true, false, 0, '{""seats"": 40, ""events_per_month"": 1, ""guest_management"": true, ""table_layout"": true, ""basic_support"": true}', NOW(), NOW()),
                (gen_random_uuid(), 'Standard', 'standard', 'Plan ideal para eventos medianos con hasta 150 invitados', 150, 99.00, 'USD', true, false, 0, '{""seats"": 150, ""events_per_month"": 3, ""guest_management"": true, ""table_layout"": true, ""task_management"": true, ""email_support"": true}', NOW(), NOW()),
                (gen_random_uuid(), 'Premium', 'premium', 'Plan profesional para eventos grandes con más de 200 invitados', 200, 199.00, 'USD', true, false, 0, '{""seats"": 999, ""events_per_month"": 10, ""guest_management"": true, ""table_layout"": true, ""task_management"": true, ""vendor_management"": true, ""priority_support"": true, ""analytics"": true}', NOW(), NOW()),
                (gen_random_uuid(), 'Planner', 'planner', 'Plan mensual para planner de eventos con eventos ilimitados', 9999, 499.00, 'USD', true, false, 0, '{""seats"": 9999, ""events_per_month"": 999, ""guest_management"": true, ""table_layout"": true, ""task_management"": true, ""vendor_management"": true, ""priority_support"": true, ""analytics"": true, ""white_label"": true, ""api_access"": true, ""dedicated_manager"": true}', NOW(), NOW())
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DELETE FROM payment_packages WHERE type IN ('free', 'standard', 'premium', 'planner');");
        }
    }
}
