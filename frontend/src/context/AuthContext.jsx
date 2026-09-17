import { createContext, useContext, useEffect, useState } from "react";
import * as authService from "../services/authService";

const AuthContext = createContext(null);

const TOKEN_KEY = "skillsphere_token";
const USER_KEY = "skillsphere_user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem(USER_KEY);
    const storedToken = localStorage.getItem(TOKEN_KEY);
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const persistSession = (data) => {
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.employee));
    setUser(data.employee);
  };

  const login = async (email, password) => {
    const response = await authService.login({ email, password });
    persistSession(response.data);
    return response.data;
  };

  const signup = async (payload) => {
    const response = await authService.signup(payload);
    persistSession(response.data);
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  };

  const updateUserInSession = (updatedEmployee) => {
    localStorage.setItem(USER_KEY, JSON.stringify(updatedEmployee));
    setUser(updatedEmployee);
  };

  const isAdmin = user?.role === "ADMIN";

  return (
    <AuthContext.Provider
      value={{ user, loading, login, signup, logout, isAdmin, updateUserInSession }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
