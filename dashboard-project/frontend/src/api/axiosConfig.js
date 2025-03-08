import axios from "axios"; // Import the Axios library

// Set the base URL for all Axios requests to your backend URL
axios.defaults.baseURL = "http://localhost:5000";

// Ensure that cookies (such as JWT tokens) are sent with each request
axios.defaults.withCredentials = true;

export default axios; // Export the configured Axios instance