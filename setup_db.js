const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function setupDatabase() {
    try {
        console.log("Connecting to MySQL...");
        // initial connection without database to create it if it doesn't exist
        const connectionParams = {
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            port: process.env.DB_PORT || 3306,
            multipleStatements: true,
            ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : null
        };

        // If a database name is provided, use it in the connection
        if (process.env.DB_NAME) {
            connectionParams.database = process.env.DB_NAME;
        }

        const connection = await mysql.createConnection(connectionParams);

        console.log("Reading database.sql...");
        const sqlPath = path.join(__dirname, 'database.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log("Executing SQL script...");
        await connection.query(sql);

        console.log("✅ Database setup completed successfully!");
        await connection.end();
        process.exit(0);
    } catch (error) {
        console.error("❌ Error setting up the database:", error.message);
        process.exit(1);
    }
}

setupDatabase();
