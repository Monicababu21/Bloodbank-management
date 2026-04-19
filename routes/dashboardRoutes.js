const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

const requireAuth = (req, res, next) => {
    if (!req.session.user) return res.redirect('/login');
    next();
};

router.use(requireAuth);
router.get('/', dashboardController.getDashboard);

module.exports = router;
