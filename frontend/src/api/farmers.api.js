import api from "./axios";

/* GET all farmers */
export const getAllFarmers = async () => {
  const res = await api.get("/farmers");
  return res.data;
};

/* GET farmer by id */
export const getFarmerById = async (id) => {
  const res = await api.get(`/farmers/${id}`);
  return res.data;
};

/* CREATE farmer */
export const createFarmer = async (farmerData) => {
  const res = await api.post("/farmers", farmerData);
  return res.data;
};

/* UPDATE farmer */
export const updateFarmer = async (id, farmerData) => {
  const res = await api.put(`/farmers/${id}`, farmerData);
  return res.data;
};

/* DELETE farmer */
export const deleteFarmer = async (id) => {
  const res = await api.delete(`/farmers/${id}`);
  return res.data;
};

/* GET farmers by Clerk id */
export const getFarmerByClerkId = async (clerkId) => {
    const res = await api.get(`/farmers/clerk/${clerkId}`);
    return res.data;
  };