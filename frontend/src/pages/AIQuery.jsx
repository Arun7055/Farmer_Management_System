import React, { useState, useRef } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  CircularProgress,
  IconButton,
  InputAdornment,
  Tooltip
} from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";

import Navbar from "../components/navbar";
import { processAIQuery, executeSQL } from "../api/ai.api";

/**
 * AIQuery Component
 * -----------------
 * Flow:
 * User enters English query (text OR voice)
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
  const [listening, setListening] = useState(false);

  const recognitionRef = useRef(null);

  /* 🎤 Voice Recognition */
  const handleMicClick = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser");
      return;
    }

    // Stop if already listening
    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = () => setListening(true);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setQuery((prev) => (prev ? prev + " " + transcript : transcript));
    };

    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;
    recognition.start();
  };

  /* 🚀 Submit Query */
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

      /* 3️⃣ Update UI */
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
          Ask your querry
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Ask about lands, crops, equipment, groups..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            sx={{ mb: 2 }}
            disabled={loading}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Tooltip title={listening ? "Stop listening" : "Speak"}>
                    <IconButton onClick={handleMicClick} disabled={loading}>
                      {listening ? (
                        <MicOffIcon color="error" />
                      ) : (
                        <MicIcon />
                      )}
                    </IconButton>
                  </Tooltip>
                </InputAdornment>
              )
            }}
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
