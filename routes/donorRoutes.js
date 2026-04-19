const express = require('express');
const router = express.Router();
const donorController = require('../controllers/donorController');

const requireAuth = (req, res, next) => {
    if (!req.session.user) return res.redirect('/login');
    next();
};

router.use(requireAuth);
router.get('/', donorController.index);
router.get('/add', donorController.getAdd);
router.post('/add', donorController.postAdd);

module.exports = router;
