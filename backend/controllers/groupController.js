import { sql } from "../config/db.js";

export const createGroup = async (req, res) => {
    const { group_name, description } = req.body;

    try {
        const result = await sql`
            INSERT INTO farmer_groups (group_name, description)
            VALUES (${group_name}, ${description})
            RETURNING *;
        `;
        res.json({ success: true, data: result[0] });
    } catch (err) {
        res.status(500).json({ error: "Error creating group" });
    }
};

export const getGroups = async (req, res) => {
    try {
        const groups = await sql`SELECT * FROM farmer_groups`;
        res.json({ success: true, data: groups });
    } catch (err) {
        res.status(500).json({ error: "Error fetching groups" });
    }
};
