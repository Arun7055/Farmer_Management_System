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
 * → backend returns SQL
 * → SQL executed via executeSQL
 * → DB rows displayed as JSON
 */

const AIQuery = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError(null);
    setResults([]);
    setMeta(null);

    try {
      /* 1️⃣ Ask AI to generate SQL */
      const aiResponse = await processAIQuery(query);

      if (!aiResponse?.success || !aiResponse?.sqlQuery) {
        throw new Error("AI failed to generate SQL");
      }

      /* 2️⃣ Execute generated SQL */
      const executionResponse = await executeSQL(aiResponse.sqlQuery);

      if (!executionResponse?.success) {
        throw new Error("SQL execution failed");
      }

      /* 3️⃣ Update UI (ALLOW empty arrays) */
      setMeta({
        sql: aiResponse.sqlQuery,
        count: Array.isArray(executionResponse.data)
          ? executionResponse.data.length
          : 0
      });

      setResults(
        Array.isArray(executionResponse.data)
          ? executionResponse.data
          : []
      );
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong");
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

        {meta && (
          <Paper sx={{ mt: 4, p: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Executed SQL
            </Typography>
            <Typography
              sx={{
                fontFamily: "monospace",
                background: "#f5f5f5",
                p: 1,
                borderRadius: 1,
                mb: 2
              }}
            >
              {meta.sql}
            </Typography>

            <Typography variant="subtitle2">
              Records found: {meta.count}
            </Typography>
          </Paper>
        )}

        {results && (
          <Paper sx={{ mt: 2, p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Result (JSON)
            </Typography>

            <pre
              style={{
                maxHeight: "400px",
                overflow: "auto",
                background: "#111",
                color: "#0f0",
                padding: "16px",
                borderRadius: "8px",
                fontSize: "13px"
              }}
            >
              {JSON.stringify(results, null, 2)}
            </pre>
          </Paper>
        )}
      </Box>
    </>
  );
};

export default AIQuery;
