using System;
using Npgsql;

class Program
{
    static void Main()
    {
        string connectionString = "Host=aws-1-us-east-1.pooler.supabase.com;Port=5432;Database=postgres;Username=postgres.pfrblrqwxxjqvzfiftei;Password=suT32430l1r1oS3094.;SSL Mode=Require;Trust Server Certificate=true";

        string sql = @"
            ALTER TABLE ""Events"" 
            ADD COLUMN IF NOT EXISTS ""event_type"" TEXT,
            ADD COLUMN IF NOT EXISTS ""celebrants"" TEXT[],
            ADD COLUMN IF NOT EXISTS ""organizer_name"" TEXT,
            ADD COLUMN IF NOT EXISTS ""religious_address"" TEXT,
            ADD COLUMN IF NOT EXISTS ""venue_address"" TEXT,
            ADD COLUMN IF NOT EXISTS ""image_url"" TEXT,
            ADD COLUMN IF NOT EXISTS ""capacity_tier"" TEXT DEFAULT 'FREE',
            ADD COLUMN IF NOT EXISTS ""guest_limit"" INTEGER DEFAULT 20;

            ALTER TABLE public.guests 
            ADD COLUMN IF NOT EXISTS plus_ones INTEGER DEFAULT 0;
        ";

        try
        {
            using var conn = new NpgsqlConnection(connectionString);
            conn.Open();
            using var cmd = new NpgsqlCommand(sql, conn);
            cmd.ExecuteNonQuery();
            Console.WriteLine("Migration applied successfully!");
        }
        catch (Exception ex)
        {
            Console.WriteLine("Error applying migration: " + ex.Message);
        }
    }
}
