using System;
using Npgsql;

class Program
{
    static void Main()
    {
        string connectionString = "Host=aws-1-us-east-1.pooler.supabase.com;Port=5432;Database=postgres;Username=postgres.pfrblrqwxxjqvzfiftei;Password=suT32430l1r1oS3094.;SSL Mode=Require;Trust Server Certificate=true";
        
        try
        {
            Console.WriteLine("Connecting to database...");
            using var conn = new NpgsqlConnection(connectionString);
            conn.Open();
            
            Console.WriteLine("=== Tables in database ===");
            using (var cmd = new NpgsqlCommand(@"
                SELECT table_schema, table_name 
                FROM information_schema.tables 
                WHERE table_schema NOT IN ('pg_catalog', 'information_schema')
                ORDER BY table_schema, table_name", conn))
            using (var reader = cmd.ExecuteReader())
            {
                while (reader.Read())
                {
                    Console.WriteLine($"  {reader.GetString(0)}.{reader.GetString(1)}");
                }
            }

            Console.WriteLine("\n=== Adding plus_ones column ===");
            using (var cmd = new NpgsqlCommand(@"
                ALTER TABLE public.guests 
                ADD COLUMN IF NOT EXISTS plus_ones INTEGER DEFAULT 0", conn))
            {
                cmd.ExecuteNonQuery();
                Console.WriteLine("  plus_ones column added!");
            }

            Console.WriteLine("\n=== Verify guest columns now ===");
            using (var cmd = new NpgsqlCommand(@"
                SELECT column_name, data_type 
                FROM information_schema.columns 
                WHERE table_name = 'guests' 
                ORDER BY ordinal_position", conn))
            using (var reader = cmd.ExecuteReader())
            {
                while (reader.Read())
                {
                    Console.WriteLine($"  {reader.GetString(0)}: {reader.GetString(1)}");
                }
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine("Error: " + ex.Message);
            Environment.Exit(1);
        }
    }
}
