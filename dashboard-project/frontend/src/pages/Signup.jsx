import React from "react";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const { user } = useAuth(); // Removed `login` since we don't need auto-login
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      navigate("/dashboard"); // Redirect to dashboard if already logged in
    }
  }, [user, navigate]);

  // Handle signup form submission
  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        password,
      });

      if (res.status === 201) {
        alert("Signup successful! Please login.");
        navigate("/login"); // Redirect to Login page instead of Dashboard
      } else {
        throw new Error("Signup failed");
      }
    } catch (error) {
      console.error("Signup error:", error.response ? error.response.data : error.message);
      alert("Signup failed. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center bg-[#010510] bg-opacity-0">
      <div className="bg-[#1e1f2a] bg-opacity-30 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">Signup</h2>
        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-3 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent text-white"
            />
          </div>
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent text-white"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent text-white"
            />
          </div>
          <button
            type="submit"
            className="w-full py-4 px-6 bg-blue-gradient font-poppins font-medium text-[18px] text-primary outline-none rounded-[10px] bg-green-500 text-white mb-4"
          >
            Signup
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;