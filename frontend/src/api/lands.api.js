import api from "./axios";

export const getAllLands = async () => {
  const res = await api.get("/lands");
  return res.data;
};

export const getLandById = async (id) => {
  const res = await api.get(`/lands/${id}`);
  return res.data;
};

export const createLand = async (data) => {
  const res = await api.post("/lands", data);
  return res.data;
};

export const updateLand = async (id, data) => {
  const res = await api.put(`/lands/${id}`, data);
  return res.data;
};

export const deleteLand = async (id) => {
  const res = await api.delete(`/lands/${id}`);
  return res.data;
};
