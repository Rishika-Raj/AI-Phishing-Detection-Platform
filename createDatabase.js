
require("dotenv").config();

const mysql = require("mysql2/promise");

async function createDatabase() {
    let connection;

    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || "localhost",
            port: Number(process.env.DB_PORT) || 3306,
            user: process.env.DB_USER || "root",
            password: process.env.DB_PASSWORD || ""
        });

        await connection.query(
            "CREATE DATABASE IF NOT EXISTS phishing_detection"
        );

        console.log("Database created successfully!");
        console.log("Database name: phishing_detection");
    } catch (error) {
        console.error("Database creation failed:", error.message);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

createDatabase();
