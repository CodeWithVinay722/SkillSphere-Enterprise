import api from "./api";

export const signup = (payload) => api.post("/auth/signup", payload);

export const login = (payload) => api.post("/auth/login", payload);

export const forgotPassword = (email) =>
  api.post("/auth/forgot-password", { email });

export const resetPassword = (token, newPassword) =>
  api.post("/auth/reset-password", { token, newPassword });
