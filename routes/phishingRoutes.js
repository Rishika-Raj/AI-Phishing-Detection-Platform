const express = require("express");
const router = express.Router();

router.post("/check", (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({
            message: "URL is required"
        });
    }

    res.json({
        url: url,
        result: "Analysis completed",
        message: "Phishing detection API is working"
    });
});

const { scanURL } = require("../controllers/urlScanController");

// POST /api/phishing/scan
router.post("/scan", scanURL);

module.exports = router;