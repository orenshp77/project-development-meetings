const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET - החזרת כל הפגישות של קבוצת פיתוח ספציפית
router.get('/team/:teamId', async (req, res) => {
    try {
        const { teamId } = req.params;
        const [rows] = await pool.query(
            `SELECT m.*, t.team_name
             FROM meetings m
             JOIN development_teams t ON m.team_id = t.team_id
             WHERE m.team_id = ?
             ORDER BY m.start_datetime`,
            [teamId]
        );
        res.json(rows);
    } catch (error) {
        console.error('Error fetching meetings:', error);
        res.status(500).json({ error: 'Failed to fetch meetings' });
    }
});

// POST - הוספת פגישה חדשה
router.post('/', async (req, res) => {
    try {
        const { team_id, start_datetime, end_datetime, description, room } = req.body;

        // וידוא שכל השדות קיימים
        if (!team_id || !start_datetime || !end_datetime || !description || !room) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const [result] = await pool.query(
            `INSERT INTO meetings (team_id, start_datetime, end_datetime, description, room)
             VALUES (?, ?, ?, ?, ?)`,
            [team_id, start_datetime, end_datetime, description, room]
        );

        res.status(201).json({
            message: 'Meeting created successfully',
            meeting_id: result.insertId
        });
    } catch (error) {
        console.error('Error creating meeting:', error);
        res.status(500).json({ error: 'Failed to create meeting' });
    }
});

// DELETE - מחיקת פגישה
router.delete('/:meetingId', async (req, res) => {
    try {
        const { meetingId } = req.params;
        const [result] = await pool.query(
            'DELETE FROM meetings WHERE meeting_id = ?',
            [meetingId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Meeting not found' });
        }

        res.json({ message: 'Meeting deleted successfully' });
    } catch (error) {
        console.error('Error deleting meeting:', error);
        res.status(500).json({ error: 'Failed to delete meeting' });
    }
});

// PUT - עדכון פגישה
router.put('/:meetingId', async (req, res) => {
    try {
        const { meetingId } = req.params;
        const { team_id, start_datetime, end_datetime, description, room } = req.body;

        if (!team_id || !start_datetime || !end_datetime || !description || !room) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const [result] = await pool.query(
            `UPDATE meetings
             SET team_id = ?, start_datetime = ?, end_datetime = ?, description = ?, room = ?
             WHERE meeting_id = ?`,
            [team_id, start_datetime, end_datetime, description, room, meetingId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Meeting not found' });
        }

        res.json({ message: 'Meeting updated successfully' });
    } catch (error) {
        console.error('Error updating meeting:', error);
        res.status(500).json({ error: 'Failed to update meeting' });
    }
});

module.exports = router;
