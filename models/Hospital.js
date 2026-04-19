const pool = require('../config/db');

class Hospital {
    static async getAll() {
        const [rows] = await pool.query('SELECT * FROM hospitals ORDER BY created_at DESC');
        return rows;
    }

    static async add(hospital) {
        const { name, email, phone, address } = hospital;
        const [result] = await pool.query(
            'INSERT INTO hospitals (name, email, phone, address) VALUES (?, ?, ?, ?)',
            [name, email, phone, address]
        );
        return result.insertId;
    }

    static async count() {
        const [rows] = await pool.query('SELECT COUNT(*) as total FROM hospitals');
        return rows[0].total;
    }
}

module.exports = Hospital;
