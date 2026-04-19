const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');

const requireAuth = (req, res, next) => {
    if (!req.session.user) return res.redirect('/login');
    next();
};

router.use(requireAuth);
router.get('/', requestController.index);
router.get('/add', requestController.getAdd);
router.post('/add', requestController.postAdd);
router.post('/:id/approve', requestController.approve);
router.post('/:id/reject', requestController.reject);

module.exports = router;
