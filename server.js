const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

// Load environment variables if needed
// require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from root directory
app.use(express.static(path.join(__dirname)));

// MongoDB Connection
mongoose.connect('mongodb+srv://yisraelkoenigsberg:VkhPXBb1J7XAVWv6@cluster0.wbu0e35.mongodb.net/UserInformation?retryWrites=true&w=majority')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB:', err));

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

// Default route - serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'login.html'));
});

// Serve additional HTML files
app.get('/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'index.html'));
});

app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'login.html'));
});

app.get('/quiz.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'quiz.html'));
});

// Handle 404 errors - IMPORTANT: Return JSON for 404s
app.use((req, res) => {
    console.log(`404 for URL: ${req.url}`);
    res.status(404).json({ error: 'Not found' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});