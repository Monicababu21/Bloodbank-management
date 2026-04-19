const pool = require('../config/db');

class Inventory {
    static async getAll() {
        const [rows] = await pool.query('SELECT * FROM blood_inventory');
        return rows;
    }

    static async addUnits(blood_group, units) {
        await pool.query('UPDATE blood_inventory SET units = units + ? WHERE blood_group = ?', [units, blood_group]);
    }

    static async subtractUnits(blood_group, units) {
        await pool.query('UPDATE blood_inventory SET units = units - ? WHERE blood_group = ? AND units >= ?', [units, blood_group, units]);
    }

    static async getTotalUnits() {
        const [rows] = await pool.query('SELECT SUM(units) as total FROM blood_inventory');
        return rows[0].total || 0;
    }

    static async getLowStock() {
        const [rows] = await pool.query('SELECT * FROM blood_inventory WHERE units < 5');
        return rows;
    }
}

module.exports = Inventory;
