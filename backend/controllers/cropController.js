import { sql } from "../config/db.js";
import Groq from "groq-sdk";

export const createCrop = async (req, res) => {
    const { farmer_id, land_id, crop_name, growth_stage, expected_yield } = req.body;

    if (!farmer_id || !land_id || !crop_name) {
        return res.status(400).json({ error: "farmer_id, land_id, and crop_name are required" });
    }

    try {
        const result = await sql`
            INSERT INTO crops (land_id, farmer_id, crop_name, growth_stage, expected_yield, created_at)
            VALUES (${land_id}, ${farmer_id}, ${crop_name}, ${growth_stage}, ${expected_yield}, DEFAULT)
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

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
  });
  
  export const getCropSummary = async (req, res) => {
    try {
      const { farmer_id } = req.body;
  
      if (!farmer_id) {
        console.log("farmer_id missing in request");
        return res.status(400).json({
          success: false,
          error: "farmer_id missing"
        });
      }
  
      /* ---------- FETCH CROPS + LAND CONTEXT ---------- */
      const crops = await sql`
        SELECT 
          c.id,
          c.crop_name,
          c.growth_stage,
          c.expected_yield,
          l.soil_type,
          l.area,
          l.location
        FROM crops c
        JOIN land l ON l.id = c.land_id
        WHERE c.farmer_id = ${farmer_id}
      `;
  
      if (crops.length === 0) {
        return res.json({
          success: true,
          summary: "No crops found for this farmer."
        });
      }
  
      /* ---------- AI PROMPT ---------- */
      const prompt = `
  You are an expert agronomist.
  
  Analyze ONLY the crops below and give insights.
  
  For EACH crop, provide:
  1. Suitability to the soil
  2. Required soil or nutrient modifications
  3. Suitable mixed cropping pairs
  4. Best crop rotation options
  5. Pest & disease risks (if any)
  6. Fertilizer requirements
  7. Irrigation pattern (low / moderate / high)
  8. Practical farmer-friendly tips
  
  Crop data:
  ${JSON.stringify(crops, null, 2)}
  
  Keep advice simple, actionable, and well-structured.
  Use bullet points, but dont include symbols like -,# or *.
  keep the text formal.
  Avoid unnecessary technical terms.
  `;
  
      /* ---------- AI CALL ---------- */
      const aiResponse = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: "You are a professional crop advisor." },
          { role: "user", content: prompt }
        ],
        temperature: 0.35
      });
  
      const summary = aiResponse.choices[0].message.content;
  
      res.json({
        success: true,
        summary
      });
  
    } catch (err) {
      console.error("CROP SUMMARY ERROR:", err);
      res.status(500).json({
        success: false,
        error: "Failed to generate crop summary"
      });
    }
  };
