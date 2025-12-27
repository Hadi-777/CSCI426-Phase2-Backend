
const express = require('express');
const router = express.Router();
const db = require('../config/db');


router.get('/discussion/:id', async (req, res) => {
    try {
        const [comments] = await db.query(`
            SELECT c.*, u.full_name as commenter_name 
            FROM comments c
            JOIN users u ON c.user_id = u.id
            WHERE c.discussion_id = ?
            ORDER BY c.created_at ASC
        `, [req.params.id]);
        
        res.json(comments);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch comments' });
    }
});


router.post('/', async (req, res) => {
    const { user_id, discussion_id, content } = req.body;
    
    try {
        const [result] = await db.query(
            'INSERT INTO comments (user_id, discussion_id, content) VALUES (?, ?, ?)',
            [user_id, discussion_id, content]
        );
        
        res.status(201).json({
            message: 'Comment created successfully',
            commentId: result.insertId
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create comment' });
    }
});

module.exports = router;




