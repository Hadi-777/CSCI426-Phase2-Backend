
const express = require('express');
const router = express.Router();
const db = require('../config/db');


router.get('/', async (req, res) => {
    try {
        const [discussions] = await db.query(`
            SELECT d.*, u.full_name as author_name 
            FROM discussions d
            JOIN users u ON d.user_id = u.id
            ORDER BY d.created_at DESC
        `);
        res.json(discussions);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch discussions' });
    }
});


router.get('/:id', async (req, res) => {
    try {
        const [discussions] = await db.query(`
            SELECT d.*, u.full_name as author_name 
            FROM discussions d
            JOIN users u ON d.user_id = u.id
            WHERE d.id = ?
        `, [req.params.id]);
        
        if (discussions.length === 0) {
            return res.status(404).json({ error: 'Discussion not found' });
        }
        
        res.json(discussions[0]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch discussion' });
    }
});


router.post('/', async (req, res) => {
    const { user_id, title, content, category } = req.body;
    
    try {
        const [result] = await db.query(
            'INSERT INTO discussions (user_id, title, content, category) VALUES (?, ?, ?, ?)',
            [user_id, title, content, category]
        );
        
        res.status(201).json({
            message: 'Discussion created successfully',
            discussionId: result.insertId
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create discussion' });
    }
});

module.exports = router;

