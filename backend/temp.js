import { sql } from "./config/db.js";

async function run() {
  try {
    await sql`
  SELECT column_name
  FROM information_schema.columns
  WHERE table_name = 'farmers';
`;

    console.log("✅ Query executed successfully");
  } catch (err) {
    console.error("❌ Error:", err);
  } finally {
    process.exit(0);
  }
}

run();
