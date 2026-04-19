const express = require('express');
const router = express.Router();
const hospitalController = require('../controllers/hospitalController');

const requireAuth = (req, res, next) => {
    if (!req.session.user) return res.redirect('/login');
    next();
};

router.use(requireAuth);
router.get('/', hospitalController.index);
router.get('/add', hospitalController.getAdd);
router.post('/add', hospitalController.postAdd);

module.exports = router;
