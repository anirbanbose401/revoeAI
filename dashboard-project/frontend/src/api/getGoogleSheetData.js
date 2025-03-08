import axios from "axios"; // Import the Axios library

/**
 * Fetches data from a Google Sheet.
 * 
 * This function sends a GET request to the "/api/sheet" endpoint
 * to retrieve data from a Google Sheet. It handles any errors that
 * occur during the request and returns the response data if the
 * request is successful.
 * 
 * @returns {Promise<Array>} The response data from the server.
 * @throws {Error} If there is an error during the request.
 */
export const getGoogleSheetData = async () => {
    try {
        const response = await axios.get("http://localhost:5000/api/sheet"); // Send GET request to the Google Sheet endpoint
        return response.data; // Return the response data
    } catch (error) {
        console.error("Error fetching Google Sheet data:", error); // Log the error
        return []; // Return an empty array in case of an error
    }
};