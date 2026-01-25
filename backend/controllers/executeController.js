import { sql } from "../config/db.js";

export const executeSQL = async (req, res) => {
  try {
    const { sqlQuery } = req.body;

    // 1️⃣ Validate input
    if (!sqlQuery || typeof sqlQuery !== "string") {
      return res.status(400).json({
        success: false,
        error: "sqlQuery missing or invalid"
      });
    }

    console.log("=== EXECUTING AI SQL ===");
    console.log(sqlQuery);

    // 2️⃣ Execute query
    const result = await sql.unsafe(sqlQuery);

    // postgres(sql``) returns ARRAY, not { rows }
    const rows = Array.isArray(result) ? result : [];

    console.log(`Rows returned: ${rows.length}`);

    // 3️⃣ Always return valid JSON
    return res.status(200).json({
      success: true,
      data: rows
    });

  } catch (err) {
    console.error("=== SQL EXECUTION ERROR ===");
    console.error(err);

    return res.status(500).json({
      success: false,
      error: "SQL execution failed",
      message: err.message // helpful for debugging
    });
  }
};
