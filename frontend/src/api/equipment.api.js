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

export const createEquipmentRequest = (data) =>
  api.post("/equipment/request", data);

export const getEquipmentRequests = (farmerId) =>
  api.get(`/equipment/request/${farmerId}`);

export const deleteEquipmentRequest = (id) =>
  api.delete(`/equipment/request/${id}`);