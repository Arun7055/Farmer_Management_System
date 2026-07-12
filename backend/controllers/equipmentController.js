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

export const toggleAvailability = async (req, res) => {
    const { id } = req.params;

    try {
        const equipment = await sql`
            SELECT availability FROM equipment WHERE id = ${id}
        `;

        if (equipment.length === 0) {
            return res.status(404).json({ error: "Equipment not found" });
        }

        const currentAvailability = equipment[0].availability;
        const updatedEquipment = await sql`
            UPDATE equipment
            SET availability = ${!currentAvailability}
            WHERE id = ${id}
            RETURNING *;
        `;

        res.json({ success: true, data: updatedEquipment[0] });
    } catch (err) {
        res.status(500).json({ error: "Error toggling availability" });
    }
};

export const createEquipmentRequest = async (req, res) => {
    const { equipment_id, requester_id } = req.body;

    try {

        // Find owner of equipment
        const equipment = await sql`
            SELECT farmer_id
            FROM equipment
            WHERE id = ${equipment_id}
        `;

        if (equipment.length === 0) {
            return res.status(404).json({
                error: "Equipment not found"
            });
        }

        const owner_id = equipment[0].farmer_id;

        // Prevent requesting own equipment
        if (owner_id === requester_id) {
            return res.status(400).json({
                error: "Cannot request your own equipment"
            });
        }

        // Prevent duplicate pending requests
        const existing = await sql`
            SELECT *
            FROM equipment_requests
            WHERE equipment_id=${equipment_id}
            AND requester_id=${requester_id}
            AND status='pending'
        `;

        if (existing.length > 0) {
            return res.status(400).json({
                error: "Request already exists"
            });
        }

        const result = await sql`
            INSERT INTO equipment_requests
            (
                equipment_id,
                owner_id,
                requester_id
            )
            VALUES
            (
                ${equipment_id},
                ${owner_id},
                ${requester_id}
            )
            RETURNING *;
        `;

        res.json({
            success: true,
            data: result[0]
        });

    } catch (err) {
        res.status(500).json({
            error: "Error creating request"
        });
    }
};

export const getEquipmentRequests = async (req, res) => {

    const { farmerId } = req.params;

    try {

        const result = await sql`

        SELECT
            r.id,
            r.status,
            r.requested_at,

            r.owner_id,
            r.requester_id,

            e.id AS equipment_id,
            e.name,
            e.type,

            owner.name AS owner_name,
            requester.name AS requester_name

        FROM equipment_requests r

        JOIN equipment e
        ON r.equipment_id=e.id

        JOIN farmers owner
        ON owner.id=r.owner_id

        JOIN farmers requester
        ON requester.id=r.requester_id

        WHERE
            r.owner_id=${farmerId}
            OR
            r.requester_id=${farmerId}

        ORDER BY r.requested_at DESC

        `;

        res.json({
            success: true,
            data: result
        });

    } catch (err) {

        res.status(500).json({
            error: "Error fetching requests"
        });

    }

};

export const deleteEquipmentRequest = async (req, res) => {

    const { id } = req.params;

    try {

        await sql`
            DELETE
            FROM equipment_requests
            WHERE id=${id}
        `;

        res.json({
            success: true
        });

    } catch (err) {

        res.status(500).json({
            error: "Error deleting request"
        });

    }

};