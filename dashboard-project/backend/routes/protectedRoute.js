const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, (req, res) => {
    res.json({ message: `Welcome, user ID: ${req.user.id}` });
});

module.exports = router;
