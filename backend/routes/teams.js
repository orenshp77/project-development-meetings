const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET - החזרת כל קבוצות הפיתוח
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM development_teams');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching teams:', error);
        res.status(500).json({ error: 'Failed to fetch teams' });
    }
});

module.exports = router;
