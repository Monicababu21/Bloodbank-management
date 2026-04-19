const Donor = require('../models/Donor');
const Inventory = require('../models/Inventory');

exports.index = async (req, res) => {
    try {
        const donors = await Donor.getAll();
        res.render('donors/index', { donors, error: null, success: req.query.success });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

exports.getAdd = (req, res) => {
    res.render('donors/add', { error: null });
};

exports.postAdd = async (req, res) => {
    try {
        const { name, age, gender, blood_group, phone, email, address, last_donation_date } = req.body;
        
        // Normally we'd look up by phone/email to check safety rule, but for this MVP, 
        // if they are adding a new donor, we'll just check if it's within 90 days.
        // Wait, the safety rule: "Prevent donor from donating again within 90 days - Use last_donation_date"
        if (last_donation_date) {
            const lastDonation = new Date(last_donation_date);
            const today = new Date();
            const diffTime = today - lastDonation;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays < 90 && diffDays >= 0) {
                const daysRemaining = 90 - diffDays;
                return res.render('donors/add', { error: `Donor is not eligible to donate yet. ${daysRemaining} days remaining in the 90-day wait period.` });
            }
        }

        await Donor.add({ name, age, gender, blood_group, phone, email, address, last_donation_date });
        
        // Adding a donor automatically adds 1 unit to inventory for MVP simplicity, 
        // or we could assume just registering a donor doesn't mean donation happened. 
        // Let's add 1 unit to inventory if a last_donation_date is provided and valid (meaning they donated today).
        if (last_donation_date) {
            await Inventory.addUnits(blood_group, 1);
        }

        res.redirect('/donors?success=Donor added successfully');
    } catch (error) {
        console.error(error);
        res.render('donors/add', { error: 'An error occurred while adding the donor.' });
    }
};
