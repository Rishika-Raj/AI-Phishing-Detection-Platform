const db = require("../config/db");
const SUSPICIOUS_PHRASES = [
    "verify your account",
    "account will be suspended",
    "account has been suspended",
    "urgent action required",
    "click immediately",
    "unusual activity",
    "your account is locked",
    "claim your reward",
    "you have won",
    "limited time"
];

const URGENCY_PHRASES = [
    "urgent",
    "immediately",
    "act now",
    "within 24 hours",
    "final warning",
    "account suspended"
];

const CREDENTIAL_PHRASES = [
    "enter your password",
    "confirm your password",
    "share your password",
    "provide your password",
    "enter your otp",
    "share your otp",
    "verify your credentials",
    "enter your credit card",
    "provide your bank details",
    "confirm your login details"
];

async function analyzeEmail(req, res) {
    const { subject = "", body = "" } = req.body || {};

    if (
        typeof subject !== "string" ||
        typeof body !== "string"
    ) {
        return res.status(400).json({
            success: false,
            message: "Subject and body must be strings."
        });
    }

    if (!subject.trim() && !body.trim()) {
        return res.status(400).json({
            success: false,
            message: "Please provide an email subject or body."
        });
    }

    // Prevent excessively large analysis requests.
    if (subject.length > 5000 || body.length > 50000) {
        return res.status(413).json({
            success: false,
            message: "Email content exceeds the allowed size."
        });
    }

    const text = `${subject}\n${body}`.toLowerCase();

    // Find suspicious phrases.
    const suspiciousKeywords = SUSPICIOUS_PHRASES.filter(
        phrase => text.includes(phrase)
    );

    const urgencyKeywords = URGENCY_PHRASES.filter(
        phrase => text.includes(phrase)
    );

    const credentialKeywords = CREDENTIAL_PHRASES.filter(
        phrase => text.includes(phrase)
    );

    // Extract links from the email.
    const linkMatches = text.match(
        /https?:\/\/[^\s<>"']+|www\.[^\s<>"']+/gi
    ) || [];

    const links = [...new Set(
        linkMatches.map(link =>
            link.replace(/[),.!?;:]+$/, "")
        )
    )];

    const credentialRequestDetected =
        credentialKeywords.length > 0;

    const httpLinks = links.filter(
        link => /^http:\/\//i.test(link)
    );

    const reasons = [];
    let riskScore = 0;

    if (suspiciousKeywords.length > 0) {
        riskScore += 20;
        reasons.push("Suspicious phrases detected");
    }

    if (urgencyKeywords.length > 0) {
        riskScore += 15;
        reasons.push("Urgent or threatening language detected");
    }

    if (credentialRequestDetected) {
        riskScore += 35;
        reasons.push("Possible request for sensitive credentials");
    }

    if (links.length > 0) {
        riskScore += 15;
        reasons.push("One or more links detected");
    }

    if (httpLinks.length > 0) {
        riskScore += 15;
        reasons.push("Link uses unencrypted HTTP");
    }

    riskScore = Math.min(riskScore, 100);

    let riskLevel;

    if (riskScore >= 60) {
        riskLevel = "high";
    } else if (riskScore >= 30) {
        riskLevel = "medium";
    } else {
        riskLevel = "low";
    }

    if (reasons.length === 0) {
        reasons.push(
            "No configured warning indicators detected"
        );
    }
    try {
    await db.execute(
        `INSERT INTO email_reports
        (
            subject,
            email_body,
            risk_level,
            risk_score,
            suspicious_keywords,
            urgency_keywords,
            credential_keywords,
            detected_links,
            reasons
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            subject,
            body,
            riskLevel,
            riskScore,
            JSON.stringify(suspiciousKeywords),
            JSON.stringify(urgencyKeywords),
            JSON.stringify(credentialKeywords),
            JSON.stringify(links),
            JSON.stringify(reasons)
        ]
    );
} catch (error) {
    console.error("Failed to save email report:", error.message);

    return res.status(500).json({
        success: false,
        message: "Email analysis completed, but saving the report failed."
    });
}


    return res.status(200).json({
        success: true,
        data: {
            riskLevel,
            riskScore,
            suspiciousKeywords,
            urgencyKeywords,
            credentialKeywords,
            links,
            credentialRequestDetected,
            reasons,
            analysisType: "rule_based",
            disclaimer:
                "This heuristic result is not proof that an email is safe or malicious."
        }
    });
}



module.exports = { analyzeEmail };
