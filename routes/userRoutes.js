
const express = require('express');
const router = express.Router();
const db = require('../config/db');


router.get('/', async (req, res) => {
    try {
        const [users] = await db.query(
            'SELECT id, email, full_name, user_type, specification, created_at FROM users'
        );
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});


router.get('/:id', async (req, res) => {
    try {
        const [users] = await db.query(
            'SELECT id, email, full_name, user_type, specification, created_at FROM users WHERE id = ?',
            [req.params.id]
        );
        
        if (users.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        res.json(users[0]);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Failed to fetch user' });
    }
});


router.post('/', async (req, res) => {
    const { email, password, full_name, user_type, specification } = req.body;
    
    try {
        const [result] = await db.query(
            'INSERT INTO users (email, password, full_name, user_type, specification) VALUES (?, ?, ?, ?, ?)',
            [email, password, full_name, user_type, specification]
        );
        
        res.status(201).json({
            message: 'User created successfully',
            userId: result.insertId
        });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Failed to create user' });
    }
});

module.exports = router;


