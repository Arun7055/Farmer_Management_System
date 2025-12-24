import api from "./axios";

export const getCustomers = async () => {
  const res = await api.get("/customers");
  return res.data;
};

export const createCustomer = async (data) => {
  const res = await api.post("/customers", data);
  return res.data;
};
