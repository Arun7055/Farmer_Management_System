import { sql } from "../config/db.js";
import Groq from "groq-sdk";

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

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });

  export const getLandSummary = async (req, res) => {
    try {
      const { farmer_id } = req.body;
  
      if (!farmer_id) {
        return res.status(400).json({ success: false, error: "farmer_id required" });
      }
  
      // 1. Fetch farmer lands
      const lands = await sql`
        SELECT area, location, soil_type
        FROM land
        WHERE farmer_id = ${farmer_id}
      `;
  
      if (lands.length === 0) {
        return res.json({
          success: true,
          summary: "You currently have no registered lands."
        });
      }
  
      // 2. Prepare data for AI
      const landDataText = lands
        .map(
          (l, i) =>
            `Land ${i + 1}: Area ${l.area} acres, Location ${l.location}, Soil ${l.soil_type || "unknown"}`
        )
        .join("\n");
  
      const prompt = `
  You are an agricultural expert.
  
  Given the following land data of a farmer:
  ${landDataText}
  
  Provide:
  1. A short summary of the farmer's land holdings
  2. Total land area
  3. Soil distribution insights
  4. Crop recommendations based on soil types
  5. 3 practical farming tips personalized to the farmer's lands
  6. green revolution practices they can be adopted personalized to the farmer's lands
  
  Keep it concise and farmer-friendly.
  do not include hashes and any other symbols/formatting in the response, keep it formal
  `;
  
      // 3. Call AI
      const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        temperature: 0.4,
        messages: [
          { role: "system", content: "You are an expert agriculture advisor" },
          { role: "user", content: prompt }
        ]
      });
  
      const summary = completion.choices[0]?.message?.content || "";
  
      res.json({
        success: true,
        summary
      });
  
    } catch (err) {
      console.error("AI SUMMARY ERROR:", err);
      res.status(500).json({ success: false, error: "Failed to generate summary" });
    }
  };