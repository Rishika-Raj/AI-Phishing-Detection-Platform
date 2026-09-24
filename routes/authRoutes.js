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

module.exports = router;