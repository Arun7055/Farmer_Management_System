import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const DB_SCHEMA = `
Tables:
- farmers(id, clerk_user_id, name, phone, address, created_at)
- farmer_groups(id, group_name, description, created_at)
- farmer_group_members(id, farmer_id, group_id, joined_at)
- land(id, farmer_id, group_id, area, location, soil_type, created_at)
- equipment(id, farmer_id, group_id, name, type, availability, created_at)
- crops(id, land_id, farmer_id, crop_name, growth_stage, expected_yield, created_at)
`;

export const processAIQuery = async (req, res) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ success: false, error: "Query is required" });
    }

    const prompt = `
Generate ONLY a PostgreSQL SELECT query.
No markdown. No backticks. No explanations.

${DB_SCHEMA}

User query:
${query}
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0,
      messages: [
        { role: "system", content: "Return only SQL SELECT query." },
        { role: "user", content: prompt }
      ]
    });

    const sqlQuery = completion.choices[0].message.content.trim();

    console.log("AI SQL:", sqlQuery);

    res.json({
      success: true,
      sqlQuery
    });

  } catch (err) {
    console.error("AI ERROR:", err);
    res.status(500).json({ success: false, error: "AI failed" });
  }
};
