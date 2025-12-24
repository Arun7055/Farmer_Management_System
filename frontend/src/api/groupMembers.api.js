import api from "./axios";

/* ADD member to group */
export const addMemberToGroup = async (data) => {
  const res = await api.post("/group-members", data);
  return res.data;
};

/* GET all group members */
export const getGroupMembers = async () => {
  const res = await api.get("/group-members");
  return res.data;
};
