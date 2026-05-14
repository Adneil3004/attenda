using System;
using Npgsql;

class Program
{
    static void Main()
    {
        string connectionString = "Host=aws-1-us-east-1.pooler.supabase.com;Port=5432;Database=postgres;Username=postgres.pfrblrqwxxjqvzfiftei;Password=suT32430l1r1oS3094.;SSL Mode=Require;Trust Server Certificate=true";

        try
        {
            using var conn = new NpgsqlConnection(connectionString);
            conn.Open();
            string sql = "SELECT table_schema, table_name FROM information_schema.tables WHERE table_name = 'users' OR table_name = 'Users';";
            using var cmd = new NpgsqlCommand(sql, conn);
            using var reader = cmd.ExecuteReader();

            Console.WriteLine("Finding 'users' table in all schemas:");
            while (reader.Read())
            {
                Console.WriteLine($"- {reader.GetString(0)}.{reader.GetString(1)}");
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine("Error: " + ex.Message);
        }
    }
}
