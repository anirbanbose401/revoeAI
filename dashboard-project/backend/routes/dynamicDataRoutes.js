const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// Define a schema for dynamic data
const DynamicDataSchema = new mongoose.Schema({
    rowIndex: Number,
    colName: String,
    value: String
});

const DynamicData = mongoose.model("DynamicData", DynamicDataSchema);

// Save dynamic column data
router.post("/saveDynamicData", async (req, res) => {
    try {
        const { rowIndex, colName, value } = req.body;
        const existingData = await DynamicData.findOne({ rowIndex, colName });

        if (existingData) {
            existingData.value = value;
            await existingData.save();
        } else {
            const newData = new DynamicData({ rowIndex, colName, value });
            await newData.save();
        }

        res.json({ message: "Data saved successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Fetch stored data
router.get("/getDynamicData", async (req, res) => {
    try {
        const data = await DynamicData.find();
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;