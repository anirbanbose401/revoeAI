const express = require("express");
const router = express.Router();
const User = require("../models/User"); // Ensure this is the correct path to your User model

// Get all users (example route)
router.get("/", async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;
