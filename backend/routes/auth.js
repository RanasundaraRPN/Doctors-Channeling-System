const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const path = require('path');
const JWT_SECRET = process.env.JWT_SECRET || 'medichannel_secret_fallback_key_123';

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'No token provided' });

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden: Admins only' });
        }
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};


// Register
router.post('/register', async (req, res) => {
    const { fullname, email, password } = req.body;
    try {
        // Check if user already exists
        const [existing] = await db.execute('SELECT email FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await db.execute(
            'INSERT INTO users (fullname, email, password, role) VALUES (?, ?, ?, "patient")',
            [fullname, email, hashedPassword]
        );
        res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Register Admin (Admin Only)
router.post('/register-admin', isAdmin, async (req, res) => {
    const { fullname, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await db.execute(
            'INSERT INTO users (fullname, email, password, role) VALUES (?, ?, ?, "admin")',
            [fullname, email, hashedPassword]
        );
        res.status(201).json({ message: 'Admin account created successfully', adminId: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Hardcoded Admin check as per requirements
        if (email && email.trim().toLowerCase() === 'admin@123' && password === 'Am456') {
            console.log('Admin login attempt via hardcoded credentials');
            const token = jwt.sign({ id: 0, role: 'admin' }, JWT_SECRET, { expiresIn: '1h' });
            return res.json({ token, user: { id: 0, fullname: 'Admin', email: 'Admin@123', role: 'admin' } });
        }

        console.log(`Login attempt for: ${email}`);
        const [users] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            console.log('User not found');
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Password mismatch');
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user: { id: user.id, fullname: user.fullname, email: user.email, role: user.role } });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            error: error.message || 'Unknown error',
            details: error.toString(),
            stack: error.stack,
            env_secret_exists: !!process.env.JWT_SECRET
        });
    }
});

// Mock Social Login
router.post('/social-login', async (req, res) => {
    const { email, fullname, provider } = req.body;
    try {
        let [users] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        let user;

        if (users.length === 0) {
            const [result] = await db.execute(
                'INSERT INTO users (fullname, email, password, role) VALUES (?, ?, "social_login_pwd", "patient")',
                [fullname, email]
            );
            user = { id: result.insertId, fullname, email, role: 'patient' };
        } else {
            user = users[0];
        }

        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user: { id: user.id, fullname: user.fullname, email: user.email, role: user.role } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update Profile
router.put('/profile/:id', async (req, res) => {
    const { id } = req.params;
    const { fullname, email } = req.body;
    try {
        await db.execute(
            'UPDATE users SET fullname = ?, email = ? WHERE id = ?',
            [fullname, email, id]
        );
        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all admins (Admin Only)
router.get('/admins', isAdmin, async (req, res) => {
    try {
        const [admins] = await db.execute('SELECT id, fullname, email, created_at FROM users WHERE role = "admin"');
        res.json(admins);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
