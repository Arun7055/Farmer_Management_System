import api from "./axios";

export const processAIQuery = async (query, farmerId) => {
  const res = await api.post("/ai/query", { query, farmerId });
  return res.data;
};
