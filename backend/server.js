const express = require('express');
const cors = require('cors');
const teamsRoutes = require('./routes/teams');
const meetingsRoutes = require('./routes/meetings');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/teams', teamsRoutes);
app.use('/api/meetings', meetingsRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
