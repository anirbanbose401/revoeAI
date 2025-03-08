import axios from "./axiosConfig"; // ✅ Import the configured Axios instance

/**
 * Fetches protected data from the server.
 * 
 * This function sends a GET request to the "/api/protected" endpoint
 * using the configured Axios instance. It handles any errors that
 * occur during the request and returns the response data if the
 * request is successful.
 * 
 * @returns {Promise<Object>} The response data from the server.
 * @throws {Error} If there is an error during the request.
 */
export const getProtectedData = async () => {
    try {
        const response = await axios.get("/api/protected"); // Send GET request to the protected endpoint
        return response.data; // Return the response data
    } catch (error) {
        console.error("Error fetching protected data:", error.response?.data || error.message); // Log the error
        throw error; // Throw the error to be handled by the caller
    }
};