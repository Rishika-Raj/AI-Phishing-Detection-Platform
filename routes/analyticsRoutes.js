
const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const {
    getAnalytics
} = require("../controllers/analyticsController");

router.get("/", protect,admin,getAnalytics);

module.exports = router;
