import "dotenv/config";
import express from "express";
import cors from "cors";
import { pool } from "./db.js";

const app = express();
app.use(cors());
app.use(express.json());

// Route א: החזרת כל קבוצות הפיתוח
app.get("/api/teams", async (_req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT team_id, team_name FROM development_teams ORDER BY team_name"
    );
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Database error" });
  }
});

// Route ב: החזרת כל הפגישות של קבוצת פיתוח ספציפית
app.get("/api/meetings/:teamId", async (req, res) => {
  try {
    const { teamId } = req.params;
    const [rows] = await pool.query(
      `SELECT
        m.meeting_id,
        m.team_id,
        m.start_datetime,
        m.end_datetime,
        m.description,
        m.room,
        t.team_name
       FROM meetings m
       JOIN development_teams t ON m.team_id = t.team_id
       WHERE m.team_id = ?
       ORDER BY m.start_datetime DESC`,
      [teamId]
    );
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Database error" });
  }
});

// Route ג: הוספת פגישה חדשה
app.post("/api/meetings", async (req, res) => {
  try {
    const { team_id, start_datetime, end_datetime, description, room } = req.body;

    // בדיקת כל השדות החובה
    if (!team_id || !start_datetime || !end_datetime || !description || !room) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // בדיקה שתאריך הסיום גדול מתאריך ההתחלה
    if (new Date(end_datetime) <= new Date(start_datetime)) {
      return res.status(400).json({ error: "End time must be after start time" });
    }

    const [result] = await pool.execute(
      "INSERT INTO meetings (team_id, start_datetime, end_datetime, description, room) VALUES (?,?,?,?,?)",
      [team_id, start_datetime, end_datetime, description, room]
    );

    res.status(201).json({
      meeting_id: result.insertId,
      message: "Meeting created successfully"
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Database error" });
  }
});

// Route נוסף: קבלת כל הפגישות (לצורך בדיקה)
app.get("/api/meetings", async (_req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT
        m.meeting_id,
        m.team_id,
        m.start_datetime,
        m.end_datetime,
        m.description,
        m.room,
        t.team_name
       FROM meetings m
       JOIN development_teams t ON m.team_id = t.team_id
       ORDER BY m.start_datetime DESC`
    );
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Database error" });
  }
});

const port = Number(process.env.PORT || 5000);
app.listen(port, () => console.log(`Meeting Management API listening on port ${port}`));
