
const express = require('express');
const router = express.Router();
const db = require('../config/db');


router.get('/', async (req, res) => {
    try {
        const [studies] = await db.query(`
            SELECT m.*, u.full_name as doctor_name 
            FROM medical_studies m
            JOIN users u ON m.doctor_id = u.id
            ORDER BY m.created_at DESC
        `);
        res.json(studies);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch medical studies' });
    }
});

router.post('/', async (req, res) => {
    const { doctor_id, title, description, disease_category, file_url } = req.body;
    
    try {
        const [result] = await db.query(
            'INSERT INTO medical_studies (doctor_id, title, description, disease_category, file_url) VALUES (?, ?, ?, ?, ?)',
            [doctor_id, title, description, disease_category, file_url]
        );
        
        res.status(201).json({
            message: 'Medical study created successfully',
            studyId: result.insertId
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create medical study' });
    }
});

module.exports = router;


