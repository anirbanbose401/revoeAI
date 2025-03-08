import axios from "./axiosConfig"; // ✅ Import the configured Axios instance

export const getProtectedData = async () => {
    try {
        const response = await axios.get("/api/protected"); 
        return response.data;
    } catch (error) {
        console.error("Error fetching protected data:", error.response?.data || error.message);
        throw error;
    }
};
