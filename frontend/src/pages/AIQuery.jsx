import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Divider,
  Chip
} from "@mui/material";
import { useState, useEffect } from "react";
import SendIcon from "@mui/icons-material/Send";
import Navbar from "../components/navbar";
import { processAIQuery } from "../api/ai.api";

export default function AIQuery() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [sqlQuery, setSqlQuery] = useState(null);
  const [rawResponse, setRawResponse] = useState(null);

  // Debug: Track when results change
  useEffect(() => {
    console.log("=== Results State Changed ===");
    console.log("results:", results);
    console.log("results type:", typeof results);
    console.log("results is array:", Array.isArray(results));
    console.log("results length:", results?.length);
    if (results && results.length > 0) {
      console.log("First result:", results[0]);
      console.log("First result keys:", Object.keys(results[0]));
    }
  }, [results]);

  /* ================= CURRENT FARMER ================= */
  const storedFarmerId = localStorage.getItem("farmer_id");
  const currentFarmerId =
    storedFarmerId && !isNaN(parseInt(storedFarmerId, 10))
      ? parseInt(storedFarmerId, 10)
      : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!query.trim()) {
      setError("Please enter a query");
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);
    setSqlQuery(null);
    setRawResponse(null);

    try {
      const response = await processAIQuery(query, currentFarmerId);
      
      console.log("=== API Response ===");
      console.log("Full response:", response);
      console.log("response.success:", response.success);
      console.log("response.data:", response.data);
      console.log("response.data type:", typeof response.data);
      console.log("response.data is array:", Array.isArray(response.data));
      console.log("response.data length:", response.data?.length);
      console.log("response.sqlQuery:", response.sqlQuery);
      
      // Simple handling - just use what comes back
      if (response.success) {
        // Extract data - make absolutely sure we're using response.data
        const data = response.data;
        
        console.log("=== Extracting Data ===");
        console.log("response.data:", data);
        console.log("response.data type:", typeof data);
        console.log("response.data is array:", Array.isArray(data));
        
        if (Array.isArray(data) && data.length > 0) {
          console.log("First data item:", data[0]);
          console.log("First data item keys:", Object.keys(data[0]));
          console.log("First data item content:", JSON.stringify(data[0], null, 2));
        }
        
        // CRITICAL: Use response.data directly, NOT response.sqlQuery
        // response.data should contain the database query results
        // response.sqlQuery should contain the SQL string (separate)
        
        if (!Array.isArray(data)) {
          console.error("ERROR: response.data is not an array!", data);
          setError("Invalid response format: data is not an array");
          return;
        }
        
        // Set results with the actual database data
        console.log("Setting results to:", data);
        setResults(data);
        
        // Set SQL query separately (this is just for display)
        if (response.sqlQuery) {
          setSqlQuery(response.sqlQuery);
        }
      } else if (response.error) {
        console.log("Error in response:", response.error);
        setError(response.error);
        setSqlQuery(response.generatedSQL || null);
        setRawResponse(response.rawResponse || null);
      } else {
        console.warn("Unexpected response format:", response);
        setError("Unexpected response format");
      }
    } catch (err) {
      console.error("=== Error ===");
      console.error("Error object:", err);
      console.error("Error response:", err.response);
      console.error("Error data:", err.response?.data);
      
      const errorData = err.response?.data || {};
      setError(errorData.error || errorData.details || "An error occurred");
      if (errorData.generatedSQL) {
        setSqlQuery(errorData.generatedSQL);
      }
      if (errorData.rawResponse) {
        setRawResponse(errorData.rawResponse);
      }
    } finally {
      setLoading(false);
    }
  };

  // Format field name for display
  const formatFieldName = (field) => {
    return field.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  // Format field value for display
  const formatFieldValue = (value) => {
    if (value === null || value === undefined) return "—";
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (typeof value === "object") return JSON.stringify(value);
    return String(value);
  };

  return (
    <>
      <Navbar />

      <Box p={4} sx={{ minHeight: "100vh" }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            background: "linear-gradient(90deg, #4caf50 0%, #8bc34a 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontWeight: 700,
            mb: 3
          }}
        >
          AI Query Assistant
        </Typography>

        <Typography variant="body1" color="text.secondary" mb={3}>
          Ask questions in natural language and get results from the database.
          Example: "Give me all lands owned by farmer 3"
        </Typography>

        {/* Query Input Form */}
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <form onSubmit={handleSubmit}>
            <Box display="flex" gap={2} alignItems="flex-start">
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Enter your query"
                placeholder='e.g., "Give me all lands owned by farmer 3"'
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                disabled={loading}
                variant="outlined"
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading || !query.trim()}
                startIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
                sx={{ minWidth: 120, height: 56 }}
              >
                {loading ? "Processing..." : "Query"}
              </Button>
            </Box>
          </form>
        </Paper>

        {/* Error Display */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* SQL Query Display - Always visible */}
        {sqlQuery && (
          <Paper elevation={1} sx={{ p: 2, mb: 3, bgcolor: "#f5f5f5" }}>
            <Typography variant="subtitle2" gutterBottom>
              Generated SQL:
            </Typography>
            <Box
              component="pre"
              sx={{
                p: 2,
                bgcolor: "#fff",
                borderRadius: 1,
                overflow: "auto",
                fontSize: "0.875rem",
                fontFamily: "monospace",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                maxHeight: "300px",
                border: "1px solid #e0e0e0"
              }}
            >
              {sqlQuery}
            </Box>
          </Paper>
        )}

        {/* Raw Response Display (for debugging) */}
        {rawResponse && (
          <Paper elevation={1} sx={{ p: 2, mb: 3, bgcolor: "#fff3cd" }}>
            <Typography variant="subtitle2" gutterBottom color="warning.main">
              Raw AI Response (for debugging):
            </Typography>
            <Box
              component="pre"
              sx={{
                p: 2,
                bgcolor: "#fff",
                borderRadius: 1,
                overflow: "auto",
                fontSize: "0.75rem",
                fontFamily: "monospace",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                maxHeight: "200px",
                border: "1px solid #ffc107"
              }}
            >
              {rawResponse}
            </Box>
          </Paper>
        )}

        {/* Simple test - always show if we have results */}
        {results && Array.isArray(results) && results.length > 0 && (
          <Alert severity="success" sx={{ mt: 3, mb: 2 }}>
            <Typography variant="body1">
              ✅ Results found! Count: {results.length}
            </Typography>
          </Alert>
        )}

        {/* Results Display - Always show if results exist */}
        {(results !== null && results !== undefined) && (
          <Paper elevation={2} sx={{ p: 3, mt: 3, bgcolor: "#fff", border: "2px solid #4caf50" }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
                {results.length > 0 
                  ? `Results (${results.length} ${results.length === 1 ? "row" : "rows"})`
                  : "Query Executed Successfully - No Rows Returned"}
              </Typography>
            </Box>
            
            {/* Debug info */}
            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="caption">
                Debug: results = {results === null ? "null" : results === undefined ? "undefined" : Array.isArray(results) ? `array[${results.length}]` : typeof results}
                {Array.isArray(results) && results.length > 0 && (
                  <> | First item keys: {Object.keys(results[0]).join(", ")}</>
                )}
              </Typography>
            </Alert>

            {Array.isArray(results) && results.length > 0 ? (
              <Box>
                {results.map((row, idx) => {
                  console.log(`Rendering row ${idx}:`, row);
                  console.log(`Row ${idx} keys:`, Object.keys(row));
                  return (
                  <Card 
                    key={idx} 
                    elevation={1} 
                    sx={{ 
                      mb: 2,
                      border: "1px solid #e0e0e0",
                      "&:hover": {
                        boxShadow: 3,
                        borderColor: "#4caf50"
                      }
                    }}
                  >
                    <CardContent>
                      <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Result #{idx + 1}
                        </Typography>
                        <Chip 
                          label={`${Object.keys(row).length} fields`} 
                          size="small" 
                          color="primary" 
                          variant="outlined"
                        />
                      </Box>
                      <Divider sx={{ my: 1.5 }} />
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                        {Object.entries(row).map(([key, value]) => (
                          <Box 
                            key={key}
                            sx={{
                              display: "flex",
                              flexDirection: { xs: "column", sm: "row" },
                              gap: 1,
                              p: 1.5,
                              bgcolor: "#fafafa",
                              borderRadius: 1,
                              border: "1px solid #f0f0f0"
                            }}
                          >
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                fontWeight: 600, 
                                minWidth: { sm: "200px" },
                                color: "#666"
                              }}
                            >
                              {formatFieldName(key)}:
                            </Typography>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                flex: 1,
                                wordBreak: "break-word",
                                fontFamily: typeof value === "number" || typeof value === "boolean" ? "monospace" : "inherit"
                              }}
                            >
                              {formatFieldValue(value)}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                  );
                })}
              </Box>
            ) : (
              <Alert severity="info">
                <Typography variant="body2" gutterBottom>
                  <strong>The SQL query executed successfully but returned no rows.</strong>
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  This could mean:
                </Typography>
                <Typography component="ul" variant="body2" sx={{ mt: 1, pl: 2 }}>
                  <li>The query is correct but there's no data matching the criteria</li>
                  <li>The farmer ID or other filter doesn't exist in the database</li>
                  <li>Try a different query or check if the data exists</li>
                </Typography>
                {sqlQuery && (
                  <Typography variant="caption" component="div" sx={{ mt: 2, fontFamily: "monospace", bgcolor: "#f5f5f5", p: 1, borderRadius: 1 }}>
                    Executed Query: {sqlQuery}
                  </Typography>
                )}
              </Alert>
            )}
          </Paper>
        )}

        {/* Show message if no results and no error - query might still be processing */}
        {!loading && results === null && !error && (
          <Alert severity="warning" sx={{ mt: 3 }}>
            No results to display. Try submitting a query.
          </Alert>
        )}

        {/* Debug: Show results state - Always visible for debugging */}
        {/* <Paper elevation={1} sx={{ p: 2, mt: 2, bgcolor: "#e3f2fd" }}>
          <Typography variant="caption" color="text.secondary" component="div">
            <strong>Debug Info:</strong><br />
            results = {results === null ? "null" : Array.isArray(results) ? `Array(${results.length})` : typeof results}<br />
            sqlQuery = {sqlQuery || "null"}<br />
            error = {error || "null"}<br />
            loading = {loading ? "true" : "false"}
          </Typography>
        </Paper> */}
      </Box>
    </>
  );
}
