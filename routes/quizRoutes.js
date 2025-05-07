// Chess quiz routes with authentication
import express from 'express';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import dotenv from 'dotenv';
import connectDB from '../javascript/databaseconnection.js';

dotenv.config();
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Authentication middleware
const authenticateUser = (req, res, next) => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        const token = authHeader.split(' ')[1];

        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);

        // Add user ID to request object
        req.userId = decoded.userId;
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' });
        }
        res.status(401).json({ message: 'Invalid token' });
    }
};

// Get all quiz results for the authenticated user
router.get('/', authenticateUser, async (req, res) => {
    try {
        const db = await connectDB();
        const quizResults = db.collection('quizResults');

        // Find quiz results for the specific user
        const userQuizResults = await quizResults
            .find({ userId: req.userId })
            .sort({ createdAt: -1 })
            .toArray();

        res.status(200).json(userQuizResults);
    } catch (error) {
        console.error('Error fetching quiz results:', error);
        res.status(500).json({ message: 'Server error while fetching quiz results' });
    }
});

// Submit a new quiz result
router.post('/submit', authenticateUser, async (req, res) => {
    try {
        const { score, totalQuestions, answers } = req.body;

        // Input validation
        if (score === undefined || !totalQuestions) {
            return res.status(400).json({ message: 'Score and totalQuestions are required' });
        }

        const db = await connectDB();

        // Find user details from the users collection
        const users = db.collection('users');
        const user = await users.findOne({ _id: new ObjectId(req.userId) });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Create new quiz result
        const newQuizResult = {
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
        };

        // Store quiz result in quizResults collection
        const quizResults = db.collection('quizResults');
        const result = await quizResults.insertOne(newQuizResult);

        // Now we need to update or create contact record
        const contacts = db.collection('contacts');

        // Check if contact already exists
        const existingContact = await contacts.findOne({
            email: user.email,
            firstname: user.firstname,
            lastname: user.lastname
        });

        if (existingContact) {
            // Update existing contact with new quiz result
            await contacts.updateOne(
                { _id: existingContact._id },
                {
                    $set: {
                        lastQuizScore: newQuizResult.score,
                        lastQuizDate: newQuizResult.createdAt
                    },
                    $push: {
                        quizHistory: {
                            score: newQuizResult.score,
                            date: newQuizResult.createdAt,
                            percentage: newQuizResult.percentage
                        }
                    }
                }
            );
        } else {
            // Create new contact with quiz result
            await contacts.insertOne({
                email: user.email,
                firstname: user.firstname,
                lastname: user.lastname,
                lastQuizScore: newQuizResult.score,
                lastQuizDate: newQuizResult.createdAt,
                quizHistory: [{
                    score: newQuizResult.score,
                    date: newQuizResult.createdAt,
                    percentage: newQuizResult.percentage
                }],
                createdAt: new Date()
            });
        }

        res.status(201).json({
            message: 'Quiz result submitted successfully',
            resultId: result.insertedId,
            result: newQuizResult
        });
    } catch (error) {
        console.error('Error submitting quiz result:', error);
        res.status(500).json({ message: 'Server error while submitting quiz result' });
    }
});

// Get a specific quiz result by ID
router.get('/:id', authenticateUser, async (req, res) => {
    try {
        const db = await connectDB();
        const quizResults = db.collection('quizResults');

        // Validate quiz result ID
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid quiz result ID' });
        }

        // Find quiz result
        const quizResult = await quizResults.findOne({
            _id: new ObjectId(req.params.id),
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

export default router;