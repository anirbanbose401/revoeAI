import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// Set the base URL for all Axios requests to your backend URL
axios.defaults.baseURL = "http://localhost:5000";
// Ensure that cookies (such as JWT tokens) are sent with each request
axios.defaults.withCredentials = true;

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user on app load
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/api/auth/me"); // Fetch user data from the server
        setUser(res.data.user); // Set the user data in state
      } catch (error) {
        setUser(null); // If there's an error, set user to null
      } finally {
        setLoading(false); // Set loading to false after the request is complete
      }
    };
    fetchUser();
  }, []);

  // Login function (No token storage)
  const login = async (email, password) => {
    try {
      await axios.post("/api/auth/login", { email, password }); // Send login request
      const res = await axios.get("/api/auth/me"); // Fetch user data after login
      setUser(res.data.user); // Set the user data in state
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message); // Log the error
      throw new Error("Login failed"); // Throw an error to be handled by the caller
    }
  };

  // Logout function (Backend clears cookie)
  const logout = async () => {
    try {
      await axios.post("/api/auth/logout", {}, { withCredentials: true }); // Send logout request
      setUser(null); // Clear the user data from state
    } catch (error) {
      console.error("Logout failed:", error.response?.data || error.message); // Log the error
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);