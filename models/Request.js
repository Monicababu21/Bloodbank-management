const pool = require('../config/db');

class Request {
    static async getAll() {
        const [rows] = await pool.query(`
            SELECT r.*, h.name as hospital_name 
            FROM blood_requests r 
            JOIN hospitals h ON r.hospital_id = h.id 
            ORDER BY r.created_at DESC
        `);
        return rows;
    }

    static async getPendingCount() {
        const [rows] = await pool.query("SELECT COUNT(*) as total FROM blood_requests WHERE status = 'Pending'");
        return rows[0].total;
    }
    
    static async getUrgentRequests() {
        const [rows] = await pool.query(`
            SELECT r.*, h.name as hospital_name 
            FROM blood_requests r 
            JOIN hospitals h ON r.hospital_id = h.id 
            WHERE status = 'Pending' AND units > 10
            ORDER BY r.created_at DESC
        `);
        return rows;
    }

    static async getRecentApproved(limit) {
        const [rows] = await pool.query(`
            SELECT r.*, h.name as hospital_name 
            FROM blood_requests r 
            JOIN hospitals h ON r.hospital_id = h.id 
            WHERE status = 'Approved'
            ORDER BY r.created_at DESC LIMIT ?
        `, [limit]);
        return rows;
    }

    static async add(request) {
        const { hospital_id, blood_group, units } = request;
        const [result] = await pool.query(
            "INSERT INTO blood_requests (hospital_id, blood_group, units, status) VALUES (?, ?, ?, 'Pending')",
            [hospital_id, blood_group, units]
        );
        return result.insertId;
    }

    static async updateStatus(id, status) {
        await pool.query('UPDATE blood_requests SET status = ? WHERE id = ?', [status, id]);
    }

    static async getById(id) {
        const [rows] = await pool.query('SELECT * FROM blood_requests WHERE id = ?', [id]);
        return rows[0];
    }
}

module.exports = Request;
