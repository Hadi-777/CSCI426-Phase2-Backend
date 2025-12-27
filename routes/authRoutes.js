const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

const db = require('../config/db');
const authMiddleware = require('../middleware/authMiddleware');

// ========== TEST GET ENDPOINTS ==========
router.get('/login', (req, res) => {
    res.json({
        success: true,
        message: "✅ Login endpoint is working!",
        note: "Use POST to actually login."
    });
});

router.get('/register', (req, res) => {
    res.json({
        success: true,
        message: "✅ Register endpoint is ready!",
        note: "Use POST to register a new user."
    });
});

// ========== DOCTORS LIST (FROM DB) ==========
router.get('/doctors', async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT id, email, full_name, user_type, specialization, created_at FROM users WHERE user_type = 'doctor' ORDER BY id DESC"
        );

        res.json({ success: true, doctors: rows });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
});

// ========== REGISTER (REAL) ==========
router.post('/register', async (req, res) => {
    try {
        const { email, password, full_name, user_type, specialization } = req.body;

        if (!email || !password || !full_name || !user_type) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        if (user_type !== 'doctor' && user_type !== 'patient') {
            return res.status(400).json({ success: false, message: "Invalid user_type (doctor|patient)" });
        }

        const [existing] = await db.query("SELECT id FROM users WHERE email = ?", [email]);
        if (existing.length > 0) {
            return res.status(409).json({ success: false, message: "Email already registered" });
        }

        const hashed = await bcrypt.hash(password, 10);

        const specValue = (user_type === 'doctor') ? (specialization || null) : null;

        const [result] = await db.query(
            "INSERT INTO users (email, password, full_name, user_type, specialization) VALUES (?, ?, ?, ?, ?)",
            [email, hashed, full_name, user_type, specValue]
        );

        const userId = result.insertId;

        const token = jwt.sign(
            { id: userId, email: email, user_type: user_type },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            success: true,
            message: "🎉 Registration successful!",
            user: {
                id: userId,
                email: email,
                full_name: full_name,
                user_type: user_type,
                specialization: specValue
            },
            token: token,
            expires_in: "24h"
        });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
});

// ========== LOGIN (REAL) ==========
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required" });
        }

        const [rows] = await db.query(
            "SELECT id, email, password, full_name, user_type, specialization, created_at FROM users WHERE email = ? LIMIT 1",
            [email]
        );

        if (rows.length === 0) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const user = rows[0];

        const ok = await bcrypt.compare(password, user.password);
        if (!ok) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, user_type: user.user_type },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            message: "🎉 Login successful!",
            user: {
                id: user.id,
                email: user.email,
                full_name: user.full_name,
                user_type: user.user_type,
                specialization: user.specialization,
                created_at: user.created_at
            },
            token: token,
            expires_in: "24h"
        });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
});

// ========== PROFILE (PROTECTED) ==========
router.get('/profile', authMiddleware, async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT id, email, full_name, user_type, specialization, created_at FROM users WHERE id = ? LIMIT 1",
            [req.user.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json({ success: true, user: rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
});

// ========== CHECK AUTH (PROTECTED) ==========
router.get('/check', authMiddleware, (req, res) => {
    res.json({
        success: true,
        authenticated: true,
        user: req.user
    });
});

// ========== LOGOUT (JWT: client just deletes token) ==========
router.get('/logout', (req, res) => {
    res.json({
        success: true,
        message: "Logged out. (Client should delete the token)"
    });
});

module.exports = router;
