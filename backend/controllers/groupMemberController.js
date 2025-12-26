import { sql } from "../config/db.js";

/* ================= ADD FARMER TO GROUP ================= */
export const addMember = async (req, res) => {
  const { groupId } = req.params;
  const { farmer_id } = req.body;

  if (!farmer_id) {
    return res.status(400).json({ error: "farmer_id is required" });
  }

  try {
    // check if already exists
    const existing = await sql`
      SELECT * FROM farmer_group_members
      WHERE group_id = ${groupId}
      AND farmer_id = ${farmer_id}
    `;

    if (existing.length > 0) {
      return res.status(409).json({ error: "Farmer already in group" });
    }

    const result = await sql`
      INSERT INTO farmer_group_members (group_id, farmer_id)
      VALUES (${groupId}, ${farmer_id})
      RETURNING *;
    `;

    res.status(201).json({
      success: true,
      data: result[0]
    });
  } catch (err) {
    console.error("ADD MEMBER ERROR:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/* ================= GET GROUP MEMBERS ================= */
export const getMembers = async (req, res) => {
  const { groupId } = req.params;

  try {
    const members = await sql`
      SELECT
        fgm.id,
        fgm.group_id,
        f.id AS farmer_id,
        f.name,
        f.phone,
        f.address,
        fgm.joined_at
      FROM farmer_group_members fgm
      JOIN farmers f ON f.id = fgm.farmer_id
      WHERE fgm.group_id = ${groupId}
      ORDER BY fgm.joined_at DESC;
    `;

    res.status(200).json({
      success: true,
      data: members
    });
  } catch (err) {
    console.error("FETCH MEMBERS ERROR:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
