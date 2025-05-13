const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

// Load environment variables
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB:', err));

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from root directory
app.use(express.static(path.join(__dirname)));



// Import routes
const contactRoutes = require('./routes/contact');
const userRoutes = require('./routes/userRoutes');
const quizRoutes = require('./routes/quizRoutes');

// Request logger
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Use routes
app.use('/api/mycontactinfo', contactRoutes);
app.use('/api/users', userRoutes);
app.use('/api/quiz', quizRoutes);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'login.html'));
});

app.get('/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'index.html'));
});

app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'login.html'));
});

app.get('/quiz.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'quiz.html'));
});

app.use((req, res) => {
    console.log(`404 for URL: ${req.url}`);
    res.status(404).json({ error: 'Not found' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});