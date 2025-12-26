import api from "./axios";

export const getGroupMembers = (groupId) =>
  api.get(`/groups/${groupId}/members`);

export const addMemberToGroup = (groupId, farmerId) =>
  api.post(`/groups/${groupId}/members`, {
    farmer_id: farmerId
  });
