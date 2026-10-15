
const db = require("../config/db");

async function getReports(req, res) {
    try {
        const {
            riskLevel,
            search,
            page = "1",
            limit = "10"
        } = req.query;

        const currentPage = Number.parseInt(page, 10);
        const pageSize = Number.parseInt(limit, 10);

        if (
            !Number.isInteger(currentPage) ||
            currentPage < 1 ||
            !Number.isInteger(pageSize) ||
            pageSize < 1 ||
            pageSize > 100
        ) {
            return res.status(400).json({
                success: false,
                message: "Page must be positive and limit must be between 1 and 100."
            });
        }

        const conditions = [];
        const values = [];

        if (riskLevel) {
            const normalizedRisk = riskLevel.toLowerCase();

            if (!["low", "medium", "high"].includes(normalizedRisk)) {
                return res.status(400).json({
                    success: false,
                    message: "riskLevel must be low, medium, or high."
                });
            }

            conditions.push("risk_level = ?");
            values.push(normalizedRisk);
        }

        if (search && search.trim()) {
            conditions.push("(subject LIKE ? OR email_body LIKE ?)");
            const searchTerm = `%${search.trim()}%`;
            values.push(searchTerm, searchTerm);
        }

        const whereClause = conditions.length
            ? `WHERE ${conditions.join(" AND ")}`
            : "";

        const [countRows] = await db.execute(
            `SELECT COUNT(*) AS total
             FROM email_reports ${whereClause}`,
            values
        );

        const offset = (currentPage - 1) * pageSize;

        const [reports] = await db.execute(
            `SELECT id, subject, risk_level, risk_score,
                    suspicious_keywords, urgency_keywords,
                    credential_keywords, detected_links, reasons,
                    created_at
             FROM email_reports
             ${whereClause}
             ORDER BY id DESC
             LIMIT ? OFFSET ?`,
            [...values, pageSize, offset]
        );

        return res.status(200).json({
            success: true,
            data: reports,
            pagination: {
                page: currentPage,
                limit: pageSize,
                total: countRows[0].total
            }
        });
    } catch (error) {
        console.error("Get reports error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to retrieve reports."
        });
    }
}

module.exports = { getReports };
