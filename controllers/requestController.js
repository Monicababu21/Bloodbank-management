const Request = require('../models/Request');
const Hospital = require('../models/Hospital');
const Inventory = require('../models/Inventory');

exports.index = async (req, res) => {
    try {
        const requests = await Request.getAll();
        res.render('requests/index', { requests, error: null, success: req.query.success });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

exports.getAdd = async (req, res) => {
    try {
        const hospitals = await Hospital.getAll();
        res.render('requests/add', { hospitals, error: null });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

exports.postAdd = async (req, res) => {
    try {
        await Request.add(req.body);
        res.redirect('/requests?success=Request created successfully');
    } catch (error) {
        console.error(error);
        const hospitals = await Hospital.getAll();
        res.render('requests/add', { hospitals, error: 'An error occurred while adding request.' });
    }
};

exports.approve = async (req, res) => {
    try {
        const requestId = req.params.id;
        const request = await Request.getById(requestId);
        if (!request || request.status !== 'Pending') {
            return res.redirect('/requests?error=Invalid request or already processed');
        }

        // Check inventory
        const invRows = await Inventory.getAll();
        const stock = invRows.find(r => r.blood_group === request.blood_group);

        if (!stock || stock.units < request.units) {
            return res.redirect('/requests?error=Not enough units in inventory to approve');
        }

        // Subtract units and update status
        await Inventory.subtractUnits(request.blood_group, request.units);
        await Request.updateStatus(requestId, 'Approved');

        res.redirect('/requests?success=Request approved successfully');
    } catch (error) {
        console.error(error);
        res.redirect('/requests?error=Server Error');
    }
};

exports.reject = async (req, res) => {
    try {
        await Request.updateStatus(req.params.id, 'Rejected');
        res.redirect('/requests?success=Request rejected');
    } catch (error) {
        console.error(error);
        res.redirect('/requests?error=Server Error');
    }
};
