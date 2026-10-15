
require("dotenv").config();

const db = require("./config/db");

async function createTable() {
    try {
        await db.query(`
            CREATE TABLE IF NOT EXISTS email_reports (
                id INT AUTO_INCREMENT PRIMARY KEY,
                subject VARCHAR(5000),
                email_body TEXT,
                risk_level VARCHAR(20) NOT NULL,
                risk_score INT NOT NULL,
                suspicious_keywords JSON,
                urgency_keywords JSON,
                credential_keywords JSON,
                detected_links JSON,
                reasons JSON,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        console.log("Email reports table created successfully!");
    } catch (error) {
        console.error("Table creation failed:", error.message);
    } finally {
        await db.end();
    }
}

createTable();
