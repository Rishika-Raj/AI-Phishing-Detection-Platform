const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "AI Phishing Detection Platform Backend is running"
    });
});

const authRoutes = require("./routes/authRoutes");
const phishingRoutes = require("./routes/phishingRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/phishing", phishingRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});