export const processAIQuery = async (query) => {
  const res = await fetch("/api/ai/query", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query })
  });

  return res.json();
};

export const executeSQL = async (sqlQuery) => {
  const res = await fetch("/api/execute-sql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sqlQuery })
  });

  return res.json();
};
