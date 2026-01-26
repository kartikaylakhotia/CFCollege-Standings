const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id);

            if (!req.user) {
                return res.status(401).json({ success: false, message: 'Not authorized, user not found' });
            }

            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ success: false, message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }
};

const isApproved = (req, res, next) => {
    if (req.user && (req.user.status === 'approved' || req.user.role === 'admin' || req.user.role === 'head-admin')) {
        next();
    } else {
        res.status(403).json({ success: false, message: 'Account pending approval' });
    }
};

const isAdmin = (req, res, next) => {
    if (req.user && (req.user.role === 'admin' || req.user.role === 'head-admin')) {
        next();
    } else {
        res.status(403).json({ success: false, message: 'Admin privileges required' });
    }
};

const isHeadAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'head-admin') {
        next();
    } else {
        res.status(403).json({ success: false, message: 'Head Admin privileges required' });
    }
};

module.exports = { protect, isApproved, isAdmin, isHeadAdmin };
