const User = require('../models/User');
const POTD = require('../models/POTD');
const { checkUserSolves } = require('../utils/codeforces');
const bcrypt = require('bcryptjs');

// @desc    Get all pending users
// @route   GET /api/admin/pending
// @access  Private (Admin/Head Admin)
const getPendingUsers = async (req, res) => {
    try {
        const users = await User.find({ status: 'pending' }).select('-password');
        res.json({ success: true, count: users.length, data: users });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Approve or Reject user
// @route   PUT /api/admin/user/:id
// @access  Private (Admin/Head Admin)
const manageUser = async (req, res) => {
    try {
        const { status } = req.body; // 'approved' or 'rejected'

        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status' });
        }

        const user = await User.findByIdAndUpdate(req.params.id, { status }, {
            new: true,
            runValidators: true
        });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.json({ success: true, data: user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Set Problem of the Day
// @route   POST /api/admin/potd
// @access  Private (Admin/Head Admin)
const setPOTD = async (req, res) => {
    try {
        const { problemId } = req.body;

        if (!problemId) {
            return res.status(400).json({ success: false, message: 'Please provide a problem ID' });
        }

        const potd = await POTD.create({
            problemId,
            dateAssigned: Date.now()
        });

        res.status(201).json({ success: true, data: potd });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Check solutions for all approved users against current POTD
// @route   GET /api/admin/check-problem
// @access  Private (Admin/Head Admin)
const checkProblem = async (req, res) => {
    try {
        // Get latest POTD
        const latestPOTD = await POTD.findOne().sort({ dateAssigned: -1 });

        if (!latestPOTD) {
            return res.status(404).json({ success: false, message: 'No POTD set' });
        }

        const problemId = latestPOTD.problemId;
        const users = await User.find({ status: 'approved' });

        const results = [];

        for (const user of users) {
            const isSolved = await checkUserSolves(user.cfHandle, problemId);
            if (isSolved) {
                // Add to user's solvedProblems if not already there
                if (!user.solvedProblems.includes(problemId)) {
                    user.solvedProblems.push(problemId);
                    await user.save();
                }
                results.push({
                    name: user.name,
                    handle: user.cfHandle,
                    status: 'Solved'
                });
            } else {
                results.push({
                    name: user.name,
                    handle: user.cfHandle,
                    status: 'Unsolved'
                });
            }
        }

        res.json({ success: true, problemId, results });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Get all users (Head Admin only)
// @route   GET /api/admin/users
// @access  Private (Head Admin)
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json({ success: true, data: users });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Add a new user (Head Admin only)
// @route   POST /api/admin/add-user
// @access  Private (Head Admin)
const addUser = async (req, res) => {
    try {
        const { name, email, password, cfHandle, role } = req.body;

        if (!name || !email || !password || !cfHandle) {
            return res.status(400).json({ success: false, message: 'Please add all required fields' });
        }

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        // Check if CF handle exists
        const handleExists = await User.findOne({ cfHandle });
        if (handleExists) {
            return res.status(400).json({ success: false, message: 'Codeforces handle already registered' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            cfHandle,
            status: 'approved', // Auto-approve manually added users
            role: role || 'user'
        });

        if (user) {
            res.status(201).json({
                success: true,
                message: 'User created successfully',
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });
        } else {
            res.status(400).json({ success: false, message: 'Invalid user data' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = {
    getPendingUsers,
    manageUser,
    setPOTD,
    checkProblem,
    getAllUsers,
    addUser
};
