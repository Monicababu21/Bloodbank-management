const Inventory = require('../models/Inventory');

exports.index = async (req, res) => {
    try {
        const inventory = await Inventory.getAll();
        res.render('inventory/index', { inventory, error: null, success: req.query.success });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

exports.getUpdate = async (req, res) => {
    try {
        const inventory = await Inventory.getAll();
        res.render('inventory/update', { inventory, error: null });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

exports.postUpdate = async (req, res) => {
    try {
        const { blood_group, units, action } = req.body;
        const parsedUnits = parseInt(units);
        if (action === 'add') {
            await Inventory.addUnits(blood_group, parsedUnits);
        } else if (action === 'subtract') {
            // Need to ensure units don't go below 0
            const rows = await Inventory.getAll();
            const current = rows.find(r => r.blood_group === blood_group);
            if (current && current.units >= parsedUnits) {
                await Inventory.subtractUnits(blood_group, parsedUnits);
            } else {
                const inventory = await Inventory.getAll();
                return res.render('inventory/update', { inventory, error: 'Not enough units in stock to subtract.' });
            }
        }
        res.redirect('/inventory?success=Inventory updated successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};
