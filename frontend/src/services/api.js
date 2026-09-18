import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://skillsphere-backend-vinay-gnhserd6fpcdfkfa.centralindia-01.azurewebsites.net/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach the JWT (if present) to every outgoing request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("skillsphere_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If the token is invalid/expired, clear the session and bounce to login.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && window.location.pathname !== "/login") {
      localStorage.removeItem("skillsphere_token");
      localStorage.removeItem("skillsphere_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
