const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/loginmodel');
const QuizResult = require('../models/quizmodel'); // Import the QuizResult model
const ObjectId = mongoose.Types.ObjectId;

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

// Authentication middleware
const authenticateUser = (req, res, next) => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        const token = authHeader.split(' ')[1];
        console.log('Verifying token. First 20 chars:', token.substring(0, 20) + '...');

        // Verify token with the server's secret
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log('Token verified successfully, user ID:', decoded.userId);

        // Add user ID to request object
        req.userId = decoded.userId;
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' });
        }
        res.status(401).json({ message: 'Invalid token: ' + error.message });
    }
};

// Get all quiz results for the authenticated user
router.get('/', authenticateUser, async (req, res) => {
    try {
        // Find quiz results for the specific user
        const userQuizResults = await QuizResult.find({ userId: req.userId })
            .sort({ createdAt: -1 });

        res.status(200).json(userQuizResults);
    } catch (error) {
        console.error('Error fetching quiz results:', error);
        res.status(500).json({ message: 'Server error while fetching quiz results' });
    }
});

// Submit a new quiz result
router.post('/submit', authenticateUser, async (req, res) => {
    try {
        console.log('Quiz submission received for user:', req.userId);
        const { score, totalQuestions, answers } = req.body;

        // Input validation
        if (score === undefined || !totalQuestions) {
            return res.status(400).json({ message: 'Score and totalQuestions are required' });
        }

        // Find user details using the User model
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        console.log(`Quiz submitted by: ${user.username}, Score: ${score}/${totalQuestions}`);

        // Create new quiz result using the imported model
        const newQuizResult = new QuizResult({
            userId: req.userId,
            username: user.username,
            email: user.email,
            firstname: user.firstname,
            lastname: user.lastname,
            score: Number(score),
            totalQuestions: Number(totalQuestions),
            percentage: Math.round((Number(score) / Number(totalQuestions)) * 100),
            answers: answers || [],
            createdAt: new Date()
        });

        // Save the quiz result
        const savedResult = await newQuizResult.save();
        console.log('Quiz result saved with ID:', savedResult._id);

        const Contact = mongoose.model('Contact');

        // Check if contact already exists
        const existingContact = await Contact.findOne({
            email: user.email,
            name: `${user.firstname} ${user.lastname}`
        });

        if (existingContact) {
            // Update existing contact with new quiz result
            existingContact.lastQuizScore = newQuizResult.score;
            existingContact.lastQuizDate = newQuizResult.createdAt;

            // Add to quiz history if it doesn't exist
            if (!existingContact.quizHistory) {
                existingContact.quizHistory = [];
            }

            existingContact.quizHistory.push({
                score: newQuizResult.score,
                date: newQuizResult.createdAt,
                percentage: newQuizResult.percentage
            });

            await existingContact.save();
            console.log('Updated existing contact with quiz result');
        } else {
            // Create new contact with quiz result
            const newContact = new Contact({
                name: `${user.firstname} ${user.lastname}`,
                email: user.email,
                lastQuizScore: newQuizResult.score,
                lastQuizDate: newQuizResult.createdAt,
                quizHistory: [{
                    score: newQuizResult.score,
                    date: newQuizResult.createdAt,
                    percentage: newQuizResult.percentage
                }]
            });

            await newContact.save();
            console.log('Created new contact with quiz result');
        }

        res.status(201).json({
            message: 'Quiz result submitted successfully',
            resultId: savedResult._id,
            result: newQuizResult
        });
    } catch (error) {
        console.error('Error submitting quiz result:', error);
        res.status(500).json({ message: 'Server error while submitting quiz result', error: error.message });
    }
});

// Get a specific quiz result by ID
router.get('/:id', authenticateUser, async (req, res) => {
    try {
        // Validate quiz result ID
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid quiz result ID' });
        }

        // Find quiz result
        const quizResult = await QuizResult.findOne({
            _id: req.params.id,
            userId: req.userId
        });

        if (!quizResult) {
            return res.status(404).json({ message: 'Quiz result not found' });
        }

        res.status(200).json(quizResult);
    } catch (error) {
        console.error('Error fetching quiz result:', error);
        res.status(500).json({ message: 'Server error while fetching quiz result' });
    }
});

// Get user statistics
router.get('/stats/summary', authenticateUser, async (req, res) => {
    try {
        // Find user's quiz results
        const quizResults = await QuizResult.find({ userId: req.userId });

        if (quizResults.length === 0) {
            return res.status(200).json({
                totalQuizzes: 0,
                averageScore: 0,
                bestScore: 0,
                recentResults: []
            });
        }

        // Calculate statistics
        const totalQuizzes = quizResults.length;
        const averageScore = quizResults.reduce((sum, quiz) => sum + quiz.percentage, 0) / totalQuizzes;
        const bestScore = Math.max(...quizResults.map(quiz => quiz.percentage));

        // Get most recent results (limited to 5)
        const recentResults = await QuizResult.find({ userId: req.userId })
            .sort({ createdAt: -1 })
            .limit(5);

        res.status(200).json({
            totalQuizzes,
            averageScore,
            bestScore,
            recentResults
        });
    } catch (error) {
        console.error('Error fetching quiz statistics:', error);
        res.status(500).json({ message: 'Server error while fetching quiz statistics' });
    }
});

module.exports = router;