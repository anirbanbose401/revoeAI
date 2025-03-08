const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const http = require("http"); // Required for socket.io
const { Server } = require("socket.io");
const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const server = http.createServer(app); // Create HTTP server
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true,
    },
});

// Google Sheets API Configuration
const SHEET_ID = process.env.GOOGLE_SHEET_ID;
const API_KEY = process.env.GOOGLE_API_KEY;
const RANGE = "Sheet1!A1:Z100"; // Modify according to your sheet range

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

// Rate Limiter (prevents abuse)
app.use(
    rateLimit({
        windowMs: 15 * 60 * 1000, // 15 mins
        max: 100, // Limit each IP to 100 requests per window
    })
);

// MongoDB Connection with Retry Logic
const connectWithRetry = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("✅ MongoDB Connected");
    } catch (err) {
        console.error("❌ MongoDB Connection Error:", err.message);
        setTimeout(connectWithRetry, 5000); // Retry after 5 seconds
    }
};
connectWithRetry();

let cachedData = []; // Store last known data

// Function to Fetch Google Sheet Data
const fetchGoogleSheetData = async () => {
    try {
        const response = await axios.get(
            `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`
        );
        const rows = response.data.values;
        if (!rows) return [];

        const headers = rows[0];
        const data = rows.slice(1).map((row) =>
            headers.reduce((acc, header, index) => {
                acc[header] = row[index] || "";
                return acc;
            }, {})
        );

        return data; // Don't update cachedData here
    } catch (error) {
        console.error("❌ Error fetching Google Sheets data:", error.message);
        return cachedData; // Return old data in case of an error
    }
};

// WebSocket Connection
io.on("connection", (socket) => {
    console.log("⚡ Client connected:", socket.id);

    // Send initial data
    fetchGoogleSheetData().then((data) => {
        socket.emit("sheetData", data);
        cachedData = data; // Store after sending
    });

    // Periodically fetch and update data only if changed
    const interval = setInterval(async () => {
        const newData = await fetchGoogleSheetData();
        
        if (JSON.stringify(newData) !== JSON.stringify(cachedData)) {
            console.log("🔄 Data changed, sending update...");
            socket.emit("sheetData", newData);
            cachedData = newData; // Update after emitting
        } else {
            console.log("✅ No changes detected in Google Sheets data.");
        }
    }, 10000); // Reduced to 10 seconds for quicker updates

    socket.on("disconnect", () => {
        console.log("❌ Client disconnected");
        clearInterval(interval);
    });
});


// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/dashboard", require("./routes/dashboard"));
app.use("/api/users", require("./routes/users"));
app.use("/api/protected", require("./routes/protectedRoute"));
app.use("/api/sheet", require("./routes/googleSheet"));
app.use("/api", require("./routes/dynamicDataRoutes"));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// Handle graceful shutdown
process.on("SIGINT", async () => {
    console.log("⚠️ Shutting down...");
    io.close(() => console.log("🛑 WebSocket Server Closed"));
    await mongoose.connection.close();
    process.exit(0);
});
