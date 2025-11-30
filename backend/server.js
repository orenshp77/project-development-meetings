const express = require('express');
const cors = require('cors');
const teamsRoutes = require('./routes/teams');
const meetingsRoutes = require('./routes/meetings');

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type']
}));
app.use(express.json());
// Initialize database
const pool = require('./config/db');
app.get("/init-db", async (req, res) => {
  try {
    await pool.query(`CREATE TABLE IF NOT EXISTS development_teams (team_id SERIAL PRIMARY KEY, team_name VARCHAR(100) NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
    await pool.query(`CREATE TABLE IF NOT EXISTS meetings (meeting_id SERIAL PRIMARY KEY, team_id INT NOT NULL, start_datetime TIMESTAMP NOT NULL, end_datetime TIMESTAMP NOT NULL, description TEXT NOT NULL, room VARCHAR(100) NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (team_id) REFERENCES development_teams(team_id) ON DELETE CASCADE)`);
    await pool.query(`INSERT INTO development_teams (team_name) SELECT 'צוות פרונטאנד' WHERE NOT EXISTS (SELECT 1 FROM development_teams)`);
    await pool.query(`INSERT INTO development_teams (team_name) VALUES ('צוות באקאנד'), ('צוות DevOps'), ('צוות QA') ON CONFLICT DO NOTHING`);
    res.json({ success: true, message: "Database initialized!" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Routes
app.use('/api/teams', teamsRoutes);
app.use('/api/meetings', meetingsRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

// Root route
app.get('/', (req, res) => {
    res.json({ message: 'Development Meetings API is running' });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
