require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const connectDB = require('../config/db');

const seedHeadAdmin = async () => {
    try {
        await connectDB();

        const email = 'kartikaylakhotia@gmail.com';
        const password = 'Kartikay';
        const cfHandle = 'kartikay_l'; // Placeholder handle, can be updated later

        // specific check for existing user to update or create
        let user = await User.findOne({ email });

        if (user) {
            console.log('User found, updating to Head Admin...');
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
            user.role = 'head-admin';
            user.status = 'approved';
            await user.save();
        } else {
            console.log('Creating new Head Admin...');
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            user = await User.create({
                name: 'Kartikay Lakhotia',
                email,
                password: hashedPassword,
                cfHandle,
                role: 'head-admin',
                status: 'approved'
            });
        }

        console.log('Head Admin Seeded Successfully');
        process.exit();
    } catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
};

seedHeadAdmin();
