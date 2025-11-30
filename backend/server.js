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
