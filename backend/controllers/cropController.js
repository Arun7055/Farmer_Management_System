import { sql } from "../config/db.js";

export const createCrop = async (req, res) => {
    const { farmer_id, land_id, crop_name, growth_stage, expected_yield } = req.body;

    if (!farmer_id || !land_id || !crop_name) {
        return res.status(400).json({ error: "farmer_id, land_id, and crop_name are required" });
    }

    try {
        const result = await sql`
            INSERT INTO crops (farmer_id, land_id, crop_name, growth_stage, expected_yield)
            VALUES (${farmer_id}, ${land_id}, ${crop_name}, ${growth_stage}, ${expected_yield})
            RETURNING *;
        `;
        res.json({ success: true, data: result[0] });
    } catch (err) {
        res.status(500).json({ error: "Error creating crop" });
    }
};

export const getAllCrops = async (req, res) => {
    try {
        const crops = await sql`SELECT * FROM crops`;
        res.json({ success: true, data: crops });
    } catch (err) {
        res.status(500).json({ error: "Error fetching crops" });
    }
};
