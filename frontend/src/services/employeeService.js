import api from "./api";

export const getEmployees = () => api.get("/employees");

export const getEmployee = (id) => api.get(`/employees/${id}`);

export const getMyProfile = () => api.get("/employees/me");

export const updateMyProfile = (payload) => api.put("/employees/me", payload);

export const changePassword = (payload) =>
  api.post("/employees/me/change-password", payload);

export const createEmployee = (employee) => api.post("/employees", employee);

export const updateEmployee = (id, employee) =>
  api.put(`/employees/${id}`, employee);

export const deleteEmployee = (id) => api.delete(`/employees/${id}`);
