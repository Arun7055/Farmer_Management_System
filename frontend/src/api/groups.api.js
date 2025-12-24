import api from "./axios";

/* CREATE group */
export const createGroup = async (groupData) => {
  const res = await api.post("/groups", groupData);
  return res.data;
};

/* GET all groups */
export const getGroups = async () => {
  const res = await api.get("/groups");
  return res.data;
};
