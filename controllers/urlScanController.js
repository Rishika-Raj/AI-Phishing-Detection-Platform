console.log(
    "VirusTotal API key loaded:",
    process.env.VIRUSTOTAL_API_KEY ? "YES" : "NO"
);
const axios = require("axios");

async function scanURL(req, res) {
    const { url } = req.body;

    // 1. Check whether URL was provided
    if (!url || typeof url !== "string" || !url.trim()) {
        return res.status(400).json({
            success: false,
            message: "Please provide a URL."
        });
    }

    const cleanURL = url.trim();

    // 2. Validate URL format
    let parsedURL;

    try {
        parsedURL = new URL(cleanURL);
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Invalid URL format."
        });
    }

    // 3. Allow only HTTP and HTTPS
    if (!["http:", "https:"].includes(parsedURL.protocol)) {
        return res.status(400).json({
            success: false,
            message: "Only HTTP and HTTPS URLs are allowed."
        });
    }

    // 4. Check VirusTotal API key
    if (!process.env.VIRUSTOTAL_API_KEY) {
        return res.status(500).json({
            success: false,
            message: "VirusTotal API key is not configured."
        });
    }

    try {
        // 5. Submit URL to VirusTotal
        const formData = new URLSearchParams();
        formData.append("url", cleanURL);

        const scanResponse = await axios.post(
            "https://www.virustotal.com/api/v3/urls",
            formData.toString(),
            {
                headers: {
                    "x-apikey": process.env.VIRUSTOTAL_API_KEY,
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            }
        );

        const analysisId = scanResponse.data.data.id;

        // 6. Return the analysis ID
        return res.status(200).json({
            success: true,
            message: "URL submitted successfully to VirusTotal.",
            data: {
                url: parsedURL.href,
                analysisId: analysisId,
                status: "submitted"
            }
        });

   } catch (error) {
    console.error("===== VIRUSTOTAL ERROR =====");
    console.error("Status:", error.response?.status);
    console.error("Response:", error.response?.data);
    console.error("Message:", error.message);
    console.error("============================");

    return res.status(500).json({
        success: false,
        message: "Failed to submit URL to VirusTotal.",
        error: error.response?.data || error.message
    });
}
}

module.exports = { scanURL };