import Groq from "groq-sdk";
import { sql } from "../config/db.js";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Database schema information for the AI
const DB_SCHEMA = `
Database Schema:
- farmers (id, clerk_user_id, name, phone, address, created_at)
- farmer_groups (id, group_name, description, created_at)
- farmer_group_members (id, farmer_id, group_id, joined_at)
- land (id, farmer_id, group_id, area, location, soil_type, created_at)
- equipment (id, farmer_id, group_id, name, type, availability, created_at)
- crops (id, land_id, farmer_id, crop_name, growth_stage, expected_yield, created_at)
- customers (id, name, phone, address, created_at)
- crop_sales (id, crop_id, customer_id, quantity, price_per_unit, sale_date)
`;

/**
 * Validates SQL query to ensure it's safe (only SELECT statements)
 */
const validateSQL = (sqlQuery) => {
  const trimmed = sqlQuery.trim().toUpperCase();
  
  // Only allow SELECT statements
  if (!trimmed.startsWith("SELECT")) {
    return { valid: false, error: "Only SELECT queries are allowed" };
  }
  
  // Block dangerous keywords - check for whole words only (not substrings)
  const dangerousKeywords = [
    "DROP", "DELETE", "UPDATE", "INSERT", "ALTER", 
    "CREATE", "TRUNCATE", "EXEC", "EXECUTE", "GRANT", 
    "REVOKE"
  ];
  
  // Check for whole word matches using word boundaries
  for (const keyword of dangerousKeywords) {
    // Use regex to match whole words only (not substrings like "created_at")
    const regex = new RegExp(`\\b${keyword}\\b`, 'i');
    if (regex.test(sqlQuery)) {
      return { valid: false, error: `Dangerous keyword detected: ${keyword}` };
    }
  }
  
  // Check for SQL comments (these are always dangerous)
  if (trimmed.includes("--") || trimmed.includes("/*") || trimmed.includes("*/")) {
    return { valid: false, error: "SQL comments are not allowed" };
  }
  
  return { valid: true };
};

/**
 * Extracts SQL from AI response (handles markdown code blocks)
 */
const extractSQL = (response) => {
  console.log("Raw AI Response:", response);
  
  // Try to extract SQL from markdown code blocks (non-greedy)
  const sqlMatch = response.match(/```(?:sql)?\s*([\s\S]*?)```/);
  if (sqlMatch && sqlMatch[1]) {
    const extracted = sqlMatch[1].trim();
    console.log("Extracted from code block:", extracted);
    return extracted;
  }
  
  // Try to find SQL statement that goes until end of line or semicolon
  // Match SELECT followed by everything until semicolon or end of string
  const selectMatch = response.match(/(SELECT[\s\S]*?)(?:;|$)/i);
  if (selectMatch && selectMatch[1]) {
    const extracted = selectMatch[1].trim();
    console.log("Extracted from SELECT match:", extracted);
    return extracted;
  }
  
  // If response starts with SELECT, take everything
  if (response.trim().toUpperCase().startsWith("SELECT")) {
    const extracted = response.trim();
    console.log("Using full response as SQL:", extracted);
    return extracted;
  }
  
  // Last resort: return trimmed response
  const extracted = response.trim();
  console.log("Using trimmed response:", extracted);
  return extracted;
};

/**
 * Converts natural language query to SQL using Groq API
 */
export const processAIQuery = async (req, res) => {
  try {
    const { query, farmerId } = req.body;

    if (!query || typeof query !== "string") {
      return res.status(400).json({ 
        error: "Query is required and must be a string" 
      });
    }

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ 
        error: "Groq API key is not configured" 
      });
    }

    // Create prompt for Groq
    const prompt = `${DB_SCHEMA}

Convert the following natural language query to a PostgreSQL SELECT statement.
Return ONLY the SQL query. Do not include any explanations, markdown code blocks, or additional text.

User Query: "${query}"

Important rules:
1. Use proper PostgreSQL syntax
2. Use table and column names exactly as shown in the schema above
3. Return ONLY the SQL SELECT statement - no markdown, no code blocks, no explanations
4. Do not include semicolons at the end
5. ALWAYS use JOINs to include related data:
   - When querying lands (e.g., "lands owned by farmer X"), ALWAYS use: SELECT l.id, l.farmer_id, l.group_id, l.area, l.location, l.soil_type, l.created_at, f.id as farmer_id, f.name as farmer_name, f.phone as farmer_phone, f.address as farmer_address FROM land l JOIN farmers f ON l.farmer_id = f.id WHERE f.id = X
   - When querying equipment, JOIN with farmers: SELECT e.*, f.id as farmer_id, f.name as farmer_name FROM equipment e JOIN farmers f ON e.farmer_id = f.id
   - When querying crops, JOIN with farmers and lands: SELECT c.*, f.id as farmer_id, f.name as farmer_name, l.location as land_location FROM crops c JOIN farmers f ON c.farmer_id = f.id JOIN land l ON c.land_id = l.id
6. When filtering by farmer ID (e.g., "farmer 3"), use: WHERE f.id = 3 or WHERE l.farmer_id = 3
7. Make sure the query is complete and executable
8. Always include farmer name and id when querying farmer-related data
9. For land queries, include ALL land fields (id, farmer_id, group_id, area, location, soil_type, created_at) plus farmer information`;

    // Call Groq API
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a SQL expert. Convert natural language queries to PostgreSQL SELECT statements. Return ONLY the SQL query, nothing else. No markdown, no code blocks, no explanations, no additional text."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.1,
      max_tokens: 1000,
    });

    const aiResponse = completion.choices[0]?.message?.content || "";
    
    console.log("Full AI Response:", JSON.stringify(aiResponse));
    
    if (!aiResponse) {
      return res.status(500).json({ 
        error: "Failed to generate SQL query from AI" 
      });
    }

    // Extract SQL from response
    let sqlQuery = extractSQL(aiResponse);
    
    // Remove trailing semicolon if present
    sqlQuery = sqlQuery.replace(/;+$/, "").trim();
    
    console.log("Final extracted SQL:", sqlQuery);
    
    // Check if SQL is too short (likely incomplete)
    if (sqlQuery.length < 20 || !sqlQuery.toUpperCase().includes("FROM")) {
      console.warn("SQL query appears incomplete:", sqlQuery);
      return res.status(400).json({ 
        error: "Generated SQL query appears incomplete. The AI may not have generated a complete query.",
        generatedSQL: sqlQuery,
        rawResponse: aiResponse
      });
    }

    // Validate SQL
    const validation = validateSQL(sqlQuery);
    if (!validation.valid) {
      return res.status(400).json({ 
        error: validation.error,
        generatedSQL: sqlQuery,
        rawResponse: aiResponse
      });
    }

    // Execute SQL query using unsafe for dynamic SQL
    // Validation already ensures only SELECT queries are allowed
    console.log("=== Executing SQL ===");
    console.log("SQL Query:", sqlQuery);
    let result;
    try {
      // Execute the query
      result = await sql.unsafe(sqlQuery);
      
      console.log("=== SQL Execution Result ===");
      console.log("Result type:", typeof result);
      console.log("Is Array:", Array.isArray(result));
      console.log("Result length:", result?.length || 0);
      
      if (Array.isArray(result) && result.length > 0) {
        console.log("First row:", result[0]);
        console.log("First row keys:", Object.keys(result[0]));
        console.log("First row JSON:", JSON.stringify(result[0], null, 2));
        console.log("First few rows:", result.slice(0, 2));
      } else {
        console.log("No rows returned or result is not an array");
      }
      
      // Verify result structure
      if (!Array.isArray(result)) {
        console.error("ERROR: sql.unsafe() did not return an array!");
        console.error("Result:", result);
      }
    } catch (sqlError) {
      console.error("SQL Execution Error:", sqlError);
      return res.status(400).json({
        error: "SQL execution failed",
        details: sqlError.message,
        generatedSQL: sqlQuery,
        rawResponse: aiResponse
      });
    }

    // Ensure result is an array
    if (!Array.isArray(result)) {
      console.warn("Result is not an array, converting:", result);
      // If result is not an array, try to convert it
      if (result && typeof result === 'object') {
        // If it's an object with rows property (some SQL libraries do this)
        if (result.rows) {
          result = result.rows;
        } else if (result.data) {
          result = result.data;
        } else {
          // If it's a single object, wrap it in an array
          result = [result];
        }
      } else {
        result = [];
      }
    }
    
    console.log("Final result array length:", result.length);
    if (result.length > 0) {
      console.log("First result item:", result[0]);
      console.log("First result item keys:", Object.keys(result[0]));
      console.log("First result item type:", typeof result[0]);
    }

    // Ensure we're sending the actual query results, not the SQL string
    const responseData = {
      success: true,
      data: result,  // This should be the array of database rows
      sqlQuery: sqlQuery,  // This is the SQL string
      query: query
    };
    
    console.log("Sending response with data length:", responseData.data.length);
    console.log("Response structure:", {
      success: responseData.success,
      dataIsArray: Array.isArray(responseData.data),
      dataLength: responseData.data.length,
      hasSqlQuery: !!responseData.sqlQuery
    });

    res.status(200).json(responseData);

  } catch (err) {
    console.error("AI Query Error:", err);
    
    // Provide helpful error messages
    if (err.message?.includes("GROQ_API_KEY")) {
      return res.status(500).json({ 
        error: "Groq API key is invalid or missing" 
      });
    }
    
    if (err.message?.includes("syntax error") || err.message?.includes("SQL")) {
      return res.status(400).json({ 
        error: "Generated SQL query has syntax errors",
        details: err.message 
      });
    }
    
    res.status(500).json({ 
      error: "Internal Server Error",
      details: err.message 
    });
  }
};
