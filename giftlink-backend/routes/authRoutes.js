/*jshint esversion: 8 */
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ObjectId = require('mongodb').ObjectId;
const connectToDatabase = require('../models/db');

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const email = req.body.email;
        const password = req.body.password;

        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const db = await connectToDatabase();
        const collection = db.collection('users');
        const existingUser = await collection.findOne({ email: email.toLowerCase() });

        if (existingUser) {
            return res.status(409).json({ message: 'User already exists' });
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const result = await collection.insertOne({
            firstName: firstName,
            lastName: lastName,
            email: email.toLowerCase(),
            password: passwordHash,
            createdAt: new Date()
        });

        return res.status(201).json({
            message: 'User registered successfully',
            userId: result.insertedId
        });
    } catch (error) {
        return res.status(500).json({ message: 'Registration failed', error: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const db = await connectToDatabase();
        const collection = db.collection('users');
        const user = await collection.findOne({ email: email.toLowerCase() });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { userId: user._id.toString(), email: user.email },
            process.env.JWT_SECRET || 'giftlink-development-secret',
            { expiresIn: '1h' }
        );

        return res.status(200).json({
            message: 'Login successful',
            token: token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            }
        });
    } catch (error) {
        return res.status(500).json({ message: 'Login failed', error: error.message });
    }
});

function authenticateToken(req, res, next) {
    const authorization = req.headers.authorization;
    const token = authorization && authorization.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Authorization token required' });
    }

    try {
        req.user = jwt.verify(
            token,
            process.env.JWT_SECRET || 'giftlink-development-secret'
        );
        return next();
    } catch (error) {
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
}

router.put('/update', authenticateToken, async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection('users');
        const user = await collection.findOne({ _id: new ObjectId(req.user.userId) });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const updates = {};
        if (req.body.firstName) {
            updates.firstName = req.body.firstName;
        }
        if (req.body.lastName) {
            updates.lastName = req.body.lastName;
        }

        await collection.updateOne(
            { _id: user._id },
            { $set: updates }
        );

        return res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Profile update failed', error: error.message });
    }
});

module.exports = router;
