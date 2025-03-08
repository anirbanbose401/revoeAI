import React from "react";
import ReactDOM from "react-dom/client"; // Correct import for React 18
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";

// Create a root element for rendering the React application
const root = ReactDOM.createRoot(document.getElementById("root"));

// Render the application
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);