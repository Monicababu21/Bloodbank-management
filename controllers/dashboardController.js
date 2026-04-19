const Donor = require('../models/Donor');
const Hospital = require('../models/Hospital');
const Inventory = require('../models/Inventory');
const Request = require('../models/Request');

exports.getDashboard = async (req, res) => {
    try {
        const totalDonors = await Donor.count();
        const totalUnits = await Inventory.getTotalUnits();
        const pendingRequests = await Request.getPendingCount();
        const totalHospitals = await Hospital.count();

        const lowStock = await Inventory.getLowStock();
        const urgentRequests = await Request.getUrgentRequests();
        const inventory = await Inventory.getAll();
        
        const recentDonors = await Donor.getRecent(5);
        const recentApprovedRequests = await Request.getRecentApproved(5);

        res.render('dashboard', {
            metrics: { totalDonors, totalUnits, pendingRequests, totalHospitals },
            alerts: { lowStock, urgentRequests },
            inventory,
            activity: { recentDonors, recentApprovedRequests }
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};
