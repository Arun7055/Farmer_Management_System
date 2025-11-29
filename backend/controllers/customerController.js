import { sql } from "../config/db.js";

export const createCustomer = async (req, res) => {
    const { name, phone, address } = req.body;

    try {
        const result = await sql`
            INSERT INTO customers (name, phone, address)
            VALUES (${name}, ${phone}, ${address})
            RETURNING *;
        `;
        res.json({ success: true, data: result[0] });
    } catch (err) {
        res.status(500).json({ error: "Error creating customer" });
    }
};

export const getCustomers = async (req, res) => {
    try {
        const customers = await sql`SELECT * FROM customers`;
        res.json({ success: true, data: customers });
    } catch (err) {
        res.status(500).json({ error: "Error fetching customers" });
    }
};
