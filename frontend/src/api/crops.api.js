import api from "./axios";

export const getAllCrops = async () => {
  const res = await api.get("/crops");
  return res.data;
};

export const createCrop = async (data) => {
  const res = await api.post("/crops", data);
  return res.data;
};
