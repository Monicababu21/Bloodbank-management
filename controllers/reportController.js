const pool = require('../config/db');

exports.index = async (req, res) => {
    try {
        // Monthly donation report (GROUP BY month)
        const [monthlyDonations] = await pool.query(`
            SELECT DATE_FORMAT(created_at, '%Y-%m') as month, COUNT(*) as count 
            FROM donors 
            GROUP BY month 
            ORDER BY month ASC
        `);

        // Blood usage statistics (Approved requests grouped by blood type)
        const [bloodUsage] = await pool.query(`
            SELECT blood_group, SUM(units) as total_used 
            FROM blood_requests 
            WHERE status = 'Approved' 
            GROUP BY blood_group
        `);

        res.render('reports/index', { 
            monthlyDonations: JSON.stringify(monthlyDonations),
            bloodUsage: JSON.stringify(bloodUsage)
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};
