// ai.api.js
const API_BASE = import.meta.env.VITE_API_BASE_URL;

export const processAIQuery = async (query) => {
  const res = await fetch(`${API_BASE}/api/ai/query`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query })
  });
  return res.json();
};

export const executeSQL = async (sqlQuery) => {
  const res = await fetch(`${API_BASE}/api/execute-sql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ sqlQuery })
  });

  const json = await res.json();

  // 🚨 HTTP-level failure
  if (!res.ok) {
    return {
      success: false,
      performed: false,
      error: json?.error || "SQL execution failed"
    };
  }

  // ✅ Normalize response for UI
  return {
    success: json.success === true,
    performed: json.performed === true,
    count: json.count ?? 0,
    columns: Array.isArray(json.columns) ? json.columns : [],
    data: Array.isArray(json.data) ? json.data : [],
    error: json.error || null
  };
};

