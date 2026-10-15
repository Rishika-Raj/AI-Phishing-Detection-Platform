
const express = require("express");
const router = express.Router();

const {
    analyzeEmail
} = require("../controllers/emailAnalysisController");

router.post("/analyze", analyzeEmail);

module.exports = router;
