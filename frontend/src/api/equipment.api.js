import api from "./axios";

export const getEquipment = async () => {
  const res = await api.get("/equipment");
  return res.data;
};

export const createEquipment = async (data) => {
  const res = await api.post("/equipment", data);
  return res.data;
};

export const toggleEquipmentAvailability = async (id) => {
  const res = await api.put(`/equipment/${id}/toggle-availability`);
  return res.data;
};
