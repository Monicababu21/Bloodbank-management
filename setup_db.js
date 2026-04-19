const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function setupDatabase() {
    try {
        console.log("Connecting to MySQL...");
        // initial connection without database to create it if it doesn't exist
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            multipleStatements: true // Allow executing multiple statements from the file
        });

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
