import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Redirect to Home */}
          <Route path="/" element={<Navigate to="/home" />} />
          
          {/* Home route */}
          <Route path="/home" element={<Home />} />
          
          {/* Login route */}
          <Route path="/login" element={<Login />} />
          
          {/* Signup route */}
          <Route path="/signup" element={<Signup />} />
          
          {/* Protected Dashboard route */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;