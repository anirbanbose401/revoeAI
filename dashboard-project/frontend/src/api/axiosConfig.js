import axios from "axios";

axios.defaults.baseURL = "http://localhost:5000"; // Your backend URL
axios.defaults.withCredentials = true; // ✅ Ensures cookies (JWT) are sent

export default axios;
