import { sql } from "../config/db.js";

export const createSale = async (req, res) => {
    const { crop_id, customer_id, quantity, price_per_unit } = req.body;

    try {
        const result = await sql`
            INSERT INTO crop_sales (crop_id, customer_id, quantity, price_per_unit)
            VALUES (${crop_id}, ${customer_id}, ${quantity}, ${price_per_unit})
            RETURNING *;
        `;
        res.json({ success: true, data: result[0] });
    } catch (err) {
        res.status(500).json({ error: "Error creating sale" });
    }
};

export const getSales = async (req, res) => {
    try {
        const sales = await sql`SELECT * FROM crop_sales`;
        res.json({ success: true, data: sales });
    } catch (err) {
        res.status(500).json({ error: "Error fetching sales" });
    }
};
