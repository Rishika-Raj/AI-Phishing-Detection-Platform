
const db = require("../config/db");

async function getAnalytics(req, res) {
    try {
        // Get total reports and risk-level counts.
        const [summaryRows] = await db.execute(`
            SELECT
                COUNT(*) AS totalReports,
                COALESCE(SUM(
                    CASE WHEN risk_level = 'high' THEN 1 ELSE 0 END
                ), 0) AS highRisk,
                COALESCE(SUM(
                    CASE WHEN risk_level = 'medium' THEN 1 ELSE 0 END
                ), 0) AS mediumRisk,
                COALESCE(SUM(
                    CASE WHEN risk_level = 'low' THEN 1 ELSE 0 END
                ), 0) AS lowRisk,
                COALESCE(ROUND(AVG(risk_score), 2), 0) AS averageRiskScore
            FROM email_reports
        `);

        // Get the five most recent reports.
        const [recentReports] = await db.execute(`
            SELECT
                id,
                subject,
                risk_level,
                risk_score,
                created_at
            FROM email_reports
            ORDER BY id DESC
            LIMIT 5
        `);

        return res.status(200).json({
            success: true,
            data: {
                summary: summaryRows[0],
                recentReports
            }
        });
    } catch (error) {
        console.error("Analytics error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to retrieve analytics."
        });
    }
}

module.exports = { getAnalytics };
