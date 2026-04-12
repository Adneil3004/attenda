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
            
            Console.WriteLine("User details:");
            using (var cmd = new NpgsqlCommand("SELECT id, email FROM profiles", conn))
            using (var reader = cmd.ExecuteReader())
            {
                while (reader.Read())
                {
                    Console.WriteLine($"- ID: {reader.GetGuid(0)}, Email: {reader.GetString(1)}");
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
