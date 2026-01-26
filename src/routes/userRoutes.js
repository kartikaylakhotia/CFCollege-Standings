const express = require('express');
const router = express.Router();
const { getDashboard } = require('../controllers/userController');
const { protect, isApproved } = require('../middleware/authMiddleware');

router.use(protect);
router.use(isApproved);

router.get('/dashboard', getDashboard);

module.exports = router;
