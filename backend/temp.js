import { sql } from "./config/db.js";

async function run() {
  try {
    await sql`
      TRUNCATE TABLE
        crops
        
      RESTART IDENTITY CASCADE;
    `;

    console.log("✅ All tables emptied successfully");
  } catch (err) {
    console.error("❌ Error truncating tables:", err);
  } finally {
    process.exit(0);
  }
}
// farmer_groups,
        // farmer_group_members,
        // land,
        // farmers,
        // equipment, 
        // customers,
        // crop_sales

run();
