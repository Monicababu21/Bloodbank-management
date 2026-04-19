const pool = require('../config/db');

class Donor {
    static async getAll() {
        const [rows] = await pool.query('SELECT * FROM donors ORDER BY created_at DESC');
        return rows;
    }

    static async getRecent(limit) {
        const [rows] = await pool.query('SELECT * FROM donors ORDER BY created_at DESC LIMIT ?', [limit]);
        return rows;
    }

    static async checkSafetyRule(donorId) {
        const [rows] = await pool.query('SELECT last_donation_date FROM donors WHERE id = ?', [donorId]);
        if (rows.length === 0 || !rows[0].last_donation_date) return true; // Safe if never donated
        
        const lastDonation = new Date(rows[0].last_donation_date);
        const today = new Date();
        const diffTime = Math.abs(today - lastDonation);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        return diffDays >= 90;
    }

    static async add(donor) {
        const { name, age, gender, blood_group, phone, email, address, last_donation_date } = donor;
        const [result] = await pool.query(
            'INSERT INTO donors (name, age, gender, blood_group, phone, email, address, last_donation_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [name, age, gender, blood_group, phone, email, address, last_donation_date || null]
        );
        return result.insertId;
    }

    static async count() {
        const [rows] = await pool.query('SELECT COUNT(*) as total FROM donors');
        return rows[0].total;
    }

    static async updateDonationDate(donorId, date) {
        await pool.query('UPDATE donors SET last_donation_date = ? WHERE id = ?', [date, donorId]);
    }
}

module.exports = Donor;
