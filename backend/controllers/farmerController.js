import { sql } from "../config/db.js";

export const getAllFarmers = async (req, res) => {
    try {
        const farmers = await sql`SELECT * FROM farmers ORDER BY created_at DESC`;
        res.status(200).json({ success: true, data: farmers });
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getFarmer = async (req, res) => {
    const { id } = req.params;
    try {
        const farmer = await sql`SELECT * FROM farmers WHERE id = ${id}`;
        if (farmer.length === 0) {
            return res.status(404).json({ error: "Farmer not found" });
        }
        res.status(200).json({ success: true, data: farmer[0] });
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getFarmerByClerkId = async (req, res) => {
    const { clerkId } = req.params;

    try {
        const farmer = await sql`
            SELECT * FROM farmers WHERE clerk_user_id = ${clerkId}
        `;

        if (farmer.length === 0) {
            return res.status(404).json({ error: "Farmer not found" });
        }

        res.status(200).json({ success: true, data: farmer[0] });
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const createFarmer = async (req, res) => {
    const { clerk_user_id, name, phone, address } = req.body;

    if (!clerk_user_id || !name) {
        return res.status(400).json({
            error: "clerk_user_id and name are required"
        });
    }

    try {
        const newFarmer = await sql`
            INSERT INTO farmers (clerk_user_id, name, phone, address)
            VALUES (${clerk_user_id}, ${name}, ${phone}, ${address})
            RETURNING *;
        `;

        res.status(201).json({
            success: true,
            data: newFarmer[0]
        });
    } catch (err) {
        // handles duplicate clerk_user_id
        if (err.code === "23505") {
            return res.status(409).json({
                error: "Farmer already exists for this Clerk user"
            });
        }
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const updateFarmer = async (req, res) => {
    const { id } = req.params;
    const { name, phone, address } = req.body;

    try {
        const updated = await sql`
            UPDATE farmers
            SET name = ${name}, phone = ${phone}, address = ${address}
            WHERE id = ${id}
            RETURNING *;
        `;
        if (updated.length === 0) {
            return res.status(404).json({ error: "Farmer not found" });
        }
        res.status(200).json({ success: true, data: updated[0] });
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const deleteFarmer = async (req, res) => {
    const { id } = req.params;

    try {
        const deleted = await sql`
            DELETE FROM farmers
            WHERE id = ${id}
            RETURNING *;
        `;
        if (deleted.length === 0) {
            return res.status(404).json({ error: "Farmer not found" });
        }
        res.status(200).json({ success: true, data: deleted[0] });
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};


