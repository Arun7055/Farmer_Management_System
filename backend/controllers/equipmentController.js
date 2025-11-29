import { sql } from "../config/db.js";

export const createEquipment = async (req, res) => {
    const { farmer_id, group_id, name, type, availability } = req.body;

    try {
        const result = await sql`
            INSERT INTO equipment (farmer_id, group_id, name, type, availability)
            VALUES (${farmer_id}, ${group_id}, ${name}, ${type}, ${availability})
            RETURNING *;
        `;
        res.json({ success: true, data: result[0] });
    } catch (err) {
        res.status(500).json({ error: "Error creating equipment" });
    }
};

export const getEquipment = async (req, res) => {
    try {
        const eq = await sql`SELECT * FROM equipment`;
        res.json({ success: true, data: eq });
    } catch (err) {
        res.status(500).json({ error: "Error fetching equipment" });
    }
};
