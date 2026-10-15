
require("dotenv").config();

const db = require("./config/db");

async function checkReports() {
    try {
        const [rows] = await db.query(
            `SELECT id, subject, risk_level, risk_score, created_at
             FROM email_reports
             ORDER BY id DESC
             LIMIT 10`
        );

        console.log("Saved email reports:");
        console.table(rows);
    } catch (error) {
        console.error(error.message);
    } finally {
        await db.end();
    }
}

checkReports();
