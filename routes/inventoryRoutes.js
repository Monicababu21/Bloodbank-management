const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

const requireAuth = (req, res, next) => {
    if (!req.session.user) return res.redirect('/login');
    next();
};

router.use(requireAuth);
router.get('/', inventoryController.index);
router.get('/update', inventoryController.getUpdate);
router.post('/update', inventoryController.postUpdate);

module.exports = router;
