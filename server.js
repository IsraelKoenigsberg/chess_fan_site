import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import connectDB from './javascript/databaseconnection.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory path for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();
console.log('Environment variables loaded');

const app = express();
const PORT = process.env.PORT || 3000;
console.log(`Server will run on port ${PORT}`);

// Configure CORS to be more permissive
app.use(cors({
    origin: '*', // Allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}));
console.log('CORS configured with permissive settings');

// Middleware
app.use(express.json());

// Request logger middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Serve static files from root directory
app.use(express.static(__dirname));
console.log(`Static files being served from: ${__dirname}`);

// API Routes
console.log('Setting up API routes');
app.use('/api/users', userRoutes);
app.use('/api/quiz', quizRoutes);


// Default route - login page
app.get('/', (req, res) => {
    console.log('Root route accessed, serving login.html');
    res.sendFile('html/login.html', { root: __dirname });
});

// Handle 404 errors
app.use((req, res) => {
    console.log(`404 for URL: ${req.url}`);
    res.status(404).send('Not found');
});

// Handle server errors with detailed logging
app.use((err, req, res, next) => {
    console.error('Server error details:');
    console.error(`Request URL: ${req.url}`);
    console.error(`Request Method: ${req.method}`);
    console.error(`Error Name: ${err.name}`);
    console.error(`Error Message: ${err.message}`);
    console.error(`Error Stack: ${err.stack}`);

    res.status(500).json({
        message: 'Server error occurred',
        error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
    });
});

// Start server only after DB connection
console.log('Attempting to connect to database before starting server...');
connectDB()
    .then(() => {
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch(err => {
        console.error('Server failed to start due to database connection error:');
        console.error(err);
        process.exit(1);
    });