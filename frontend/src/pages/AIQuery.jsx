import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  CircularProgress
} from "@mui/material";
import Navbar from "../components/navbar";
import { processAIQuery, executeSQL } from "../api/ai.api";

/**
 * AIQuery Component
 * -----------------
 * Flow:
 * User enters English query
 * → sent to backend via processAIQuery
 * → backend generates SQL
 * → backend executes sql.unsafe()
 * → DB rows returned
 * → rows displayed here
 */
const AIQuery = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Handle form submit
   * Calls AI backend and executes SQL query
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!query.trim()) {
      setError("Please enter a query");
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      // 🔥 SINGLE API CALL: AI generates SQL
      const response = await processAIQuery(query);
      console.log("AI Query Response:", response);

      if (!response.success || !response.sqlQuery) {
        setError("Failed to generate SQL from AI");
        return;
      }

      // 🔥 Execute the SQL query
      const executionResponse = await executeSQL(response.sqlQuery);
      console.log("SQL Execution Response:", executionResponse);

      if (!executionResponse.success) {
        setError("Failed to execute SQL query");
        return;
      }

      // Normalize result: ensure an array of rows
      const rows =
        Array.isArray(executionResponse.data)
          ? executionResponse.data
          : executionResponse.data?.rows || [];

      // Log the results to check the data
      console.log("Fetched Results:", rows);

      if (rows.length === 0) {
        setResults(null);
        setError("No data found for the given query.");
        return;
      }

      // If results cannot be displayed as a table, display as JSON
      if (rows.length > 0 && typeof rows[0] !== "object") {
        setResults([{ data: JSON.stringify(rows) }]);
      } else {
        setResults(rows);
      }
    } catch (err) {
      console.error("AI Query Error:", err);
      setError("Something went wrong while fetching data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <Box sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Ask in English
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Ask about lands, crops, equipment, groups..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            sx={{ mb: 2 }}
            disabled={loading}
          />

          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : "Ask"}
          </Button>
        </form>

        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}

        {results && results.length > 0 && (
          <Paper sx={{ mt: 4, p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Results
            </Typography>

            <Box sx={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    {Object.keys(results[0]).map((key) => (
                      <th
                        key={key}
                        style={{
                          border: "1px solid #ccc",
                          padding: "8px",
                          textAlign: "left",
                          background: "#f5f5f5",
                          position: "sticky",
                          top: 0,
                          zIndex: 1
                        }}
                      >
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {results.map((row, idx) => (
                    <tr key={idx}>
                      {Object.values(row).map((val, i) => (
                        <td
                          key={i}
                          style={{
                            border: "1px solid #ccc",
                            padding: "8px",
                            verticalAlign: "top"
                          }}
                        >
                          {val === null
                            ? "NULL"
                            : typeof val === "object"
                            ? JSON.stringify(val, null, 2)
                            : val.toString()}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
          </Paper>
        )}

        {results && results.length === 0 && (
          <Typography sx={{ mt: 4 }}>No records found.</Typography>
        )}
      </Box>
    </>
  );
};

export default AIQuery;
