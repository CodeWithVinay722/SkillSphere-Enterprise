import api from "./api";

export const getAllSkills = () => api.get("/skills");

export const getMySkills = () => api.get("/employees/me/skills");

export const addOrUpdateMySkill = (payload) =>
  api.post("/employees/me/skills", payload);

export const removeMySkill = (skillId) =>
  api.delete(`/employees/me/skills/${skillId}`);
