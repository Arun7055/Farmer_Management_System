import { sql } from "../config/db.js";

export const getAllLands = async (req, res) => {
    try {
        const lands = await sql`
            SELECT * FROM land ORDER BY created_at DESC
        `;
        res.status(200).json({ success: true, data: lands });
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getLand = async (req, res) => {
    const { id } = req.params;

    try {
        const land = await sql`
            SELECT * FROM land WHERE id = ${id}
        `;
        if (land.length === 0) {
            return res.status(404).json({ error: "Land not found" });
        }
        res.status(200).json({ success: true, data: land[0] });
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const createLand = async (req, res) => {
    const { farmer_id, group_id, area, location, soil_type } = req.body;

    if (!farmer_id || !area || !location) {
        return res.status(400).json({ error: "farmer_id, area, and location are required" });
    }

    try {
        const newLand = await sql`
            INSERT INTO land (farmer_id, group_id, area, location, soil_type)
            VALUES (${farmer_id}, ${group_id}, ${area}, ${location}, ${soil_type})
            RETURNING *;
        `;
        res.status(201).json({ success: true, data: newLand[0] });
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const updateLand = async (req, res) => {
    const { id } = req.params;
    const { farmer_id, group_id, area, location, soil_type } = req.body;

    try {
        const updated = await sql`
            UPDATE land 
            SET farmer_id = ${farmer_id},
                group_id = ${group_id},
                area = ${area},
                location = ${location},
                soil_type = ${soil_type}
            WHERE id = ${id}
            RETURNING *;
        `;

        if (updated.length === 0) {
            return res.status(404).json({ error: "Land not found" });
        }

        res.status(200).json({ success: true, data: updated[0] });
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const deleteLand = async (req, res) => {
    const { id } = req.params;

    try {
        const deleted = await sql`
            DELETE FROM land WHERE id = ${id} RETURNING *;
        `;

        if (deleted.length === 0) {
            return res.status(404).json({ error: "Land not found" });
        }

        res.status(200).json({ success: true, data: deleted[0] });
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};