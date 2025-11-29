import { sql } from "../config/db.js";

export const addMember = async (req, res) => {
    const { farmer_id, group_id } = req.body;

    try {
        const result = await sql`
            INSERT INTO farmer_group_members (farmer_id, group_id)
            VALUES (${farmer_id}, ${group_id})
            RETURNING *;
        `;
        res.json({ success: true, data: result[0] });
    } catch (err) {
        res.status(500).json({ error: "Error adding member" });
    }
};

export const getMembers = async (req, res) => {
    try {
        const members = await sql`SELECT * FROM farmer_group_members`;
        res.json({ success: true, data: members });
    } catch (err) {
        res.status(500).json({ error: "Error fetching members" });
    }
};
