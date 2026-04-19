const mysql = require('mysql2/promise');
require('dotenv').config();

async function seedDatabase() {
    try {
        console.log("Connecting to MySQL to seed data...");
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'bloodbank',
            multipleStatements: true
        });

        console.log("Running seed queries...");

        const sql = `
            -- 1. Add Fake Hospitals
            INSERT IGNORE INTO hospitals (id, name, email, phone, address, created_at) VALUES 
            (1, 'City General Hospital', 'contact@citygeneral.com', '555-0100', '123 Health Way, Downtown', NOW()),
            (2, 'Mercy Medical Center', 'emergency@mercymedical.org', '555-0200', '456 Compassion Ave, Westside', NOW()),
            (3, 'St. Jude Children''s Clinic', 'info@stjudeclinic.org', '555-0300', '789 Healing Blvd, North Park', NOW()),
            (4, 'Lakeside Regional Hospital', 'admin@lakesideregional.com', '555-0400', '101 Waterside Dr, East End', NOW());

            -- 2. Add Fake Donors (Some with recent donations, some safe to donate)
            INSERT IGNORE INTO donors (name, age, gender, blood_group, phone, email, address, last_donation_date, created_at) VALUES 
            ('John Doe', 28, 'Male', 'O+', '555-1111', 'johndoe@email.com', '12 Maple St.', DATE_SUB(CURDATE(), INTERVAL 120 DAY), NOW()),
            ('Jane Smith', 34, 'Female', 'A-', '555-2222', 'janesmith@email.com', '34 Oak Ave.', DATE_SUB(CURDATE(), INTERVAL 20 DAY), NOW()),
            ('Michael Johnson', 45, 'Male', 'B+', '555-3333', 'mjohnson@email.com', '56 Pine Rd.', DATE_SUB(CURDATE(), INTERVAL 10 DAY), NOW()),
            ('Emily Davis', 22, 'Female', 'O-', '555-4444', 'edavis@email.com', '78 Elm St.', NULL, NOW()),
            ('David Wilson', 50, 'Male', 'AB+', '555-5555', 'dwilson@email.com', '90 Cedar Ln.', DATE_SUB(CURDATE(), INTERVAL 200 DAY), NOW()),
            ('Sarah Brown', 29, 'Female', 'A+', '555-6666', 'sbrown@email.com', '11 Birch Blvd.', DATE_SUB(CURDATE(), INTERVAL 30 DAY), NOW()),
            ('Chris Miller', 31, 'Male', 'B-', '555-7777', 'cmiller@email.com', '22 Spruce Dr.', DATE_SUB(CURDATE(), INTERVAL 150 DAY), NOW());

            -- 3. Add Fake Blood Requests (Linked to Hospitals)
            INSERT IGNORE INTO blood_requests (hospital_id, blood_group, units, status, created_at) VALUES 
            (1, 'O+', 12, 'Pending', NOW()),
            (2, 'A-', 3, 'Pending', DATE_SUB(NOW(), INTERVAL 1 DAY)),
            (3, 'B+', 15, 'Pending', NOW()),
            (4, 'O-', 5, 'Approved', DATE_SUB(NOW(), INTERVAL 2 DAY)),
            (1, 'AB+', 8, 'Rejected', DATE_SUB(NOW(), INTERVAL 3 DAY)),
            (2, 'A+', 4, 'Approved', DATE_SUB(NOW(), INTERVAL 4 DAY));
        `;

        await connection.query(sql);

        console.log("✅ Fake data seeded successfully! Your dashboard is now full of data.");
        await connection.end();
        process.exit(0);
    } catch (error) {
        console.error("❌ Error seeding the database:", error.message);
        process.exit(1);
    }
}

seedDatabase();
