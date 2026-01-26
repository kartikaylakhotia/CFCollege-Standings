const express = require('express');
const router = express.Router();
const {
    getPendingUsers,
    manageUser,
    setPOTD,
    checkProblem,
    getAllUsers,
    addUser
} = require('../controllers/adminController');
const { protect, isAdmin, isHeadAdmin } = require('../middleware/authMiddleware');

router.use(protect); // All admin routes require login

router.get('/pending', isAdmin, getPendingUsers);
router.put('/user/:id', isAdmin, manageUser);
router.post('/potd', isAdmin, setPOTD);
router.get('/check-problem', isAdmin, checkProblem);
router.get('/users', isHeadAdmin, getAllUsers);
router.post('/add-user', isHeadAdmin, addUser);

module.exports = router;
