const { Client } = require('pg');
const client = new Client({
  connectionString: "postgresql://postgres.pfrblrqwxxjqvzfiftei:suT32430l1r1oS3094.@aws-1-us-east-1.pooler.supabase.com:5432/postgres?sslmode=require"
});
async function check() {
  await client.connect();
  const res = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';");
  console.log(res.rows.map(r => r.table_name));
  await client.end();
}
check().catch(console.error);
