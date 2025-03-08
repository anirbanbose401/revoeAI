import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:5000";
axios.defaults.withCredentials = true; // ✅ Enable cookies

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user on app load
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/api/auth/me"); // ✅ No token needed
        setUser(res.data.user);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // Login function (No token storage)
  const login = async (email, password) => {
    try {
      await axios.post("/api/auth/login", { email, password });
      const res = await axios.get("/api/auth/me"); // ✅ Fetch user after login
      setUser(res.data.user);
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      throw new Error("Login failed");
    }
  };

  // Logout function (Backend clears cookie)
const logout = async () => {
  try {
    await axios.post("http://localhost:5000/api/auth/logout", {}, { withCredentials: true });
    setUser(null);
  } catch (error) {
    console.error("Logout failed:", error.response?.data || error.message);
  }
};

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
