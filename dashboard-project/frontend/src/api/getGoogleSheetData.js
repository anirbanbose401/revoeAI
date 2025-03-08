import axios from "axios";

export const getGoogleSheetData = async () => {
    try {
        const response = await axios.get("http://localhost:5000/api/sheet");
        return response.data;
    } catch (error) {
        console.error("Error fetching Google Sheet data:", error);
        return [];
    }
};
