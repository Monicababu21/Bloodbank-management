const Hospital = require('../models/Hospital');

exports.index = async (req, res) => {
    try {
        const hospitals = await Hospital.getAll();
        res.render('hospitals/index', { hospitals, error: null, success: req.query.success });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

exports.getAdd = (req, res) => {
    res.render('hospitals/add', { error: null });
};

exports.postAdd = async (req, res) => {
    try {
        await Hospital.add(req.body);
        res.redirect('/hospitals?success=Hospital added successfully');
    } catch (error) {
        console.error(error);
        res.render('hospitals/add', { error: 'An error occurred while adding the hospital.' });
    }
};
