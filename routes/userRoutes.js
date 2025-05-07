// User routes for authentication
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import dotenv from 'dotenv';
import connectDB from '../javascript/databaseconnection.js';
dotenv.config();
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// User registration
router.post('/register', async (req, res) => {
    console.log('Register endpoint called with data:', {
        ...req.body,
        password: req.body.password ? '********' : undefined // Mask password in logs
    });

    try {
        const { firstname, lastname, username, email, password } = req.body;

        // Input validation
        if (!firstname || !lastname || !username || !email || !password) {
            console.log('Registration failed: Missing required fields');
            return res.status(400).json({ message: 'All fields are required' });
        }

        console.log('Connecting to database...');
        const db = await connectDB();
        console.log('Database connection successful');

        console.log('Getting users collection...');
        const users = db.collection('users');
        console.log('Users collection accessed');

        // Check if user already exists
        console.log('Checking if user already exists...');
        const existingUser = await users.findOne({
            $or: [{ username }, { email }]
        });

        if (existingUser) {
            console.log('Registration failed: Username or email already in use');
            return res.status(409).json({
                message: 'Username or email already in use'
            });
        }

        // Hash the password
        console.log('Hashing password...');
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Password hashed successfully');

        // Create new user
        const newUser = {
            firstname,
            lastname,
            username,
            email,
            password: hashedPassword,
            createdAt: new Date()
        };

        // Insert user into database
        console.log('Inserting new user into database...');
        await users.insertOne(newUser);
        console.log('User inserted successfully');

        // Response without password
        const { password: _, ...userWithoutPassword } = newUser;

        console.log('Registration successful for user:', username);
        res.status(201).json({
            message: 'User created successfully',
            user: userWithoutPassword
        });
    } catch (error) {
        console.error('Registration error details:');
        console.error(`Error Name: ${error.name}`);
        console.error(`Error Message: ${error.message}`);
        console.error(`Error Stack: ${error.stack}`);
        res.status(500).json({
            message: 'Server error during registration',
            error: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message
        });
    }
});

// User login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Input validation
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        const db = await connectDB();
        const users = db.collection('users');

        // Find user by username
        const user = await users.findOne({ username });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id.toString() },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                firstname: user.firstname,
                lastname: user.lastname
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
});

// Get user profile (authenticated)
router.get('/profile', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);

        const db = await connectDB();
        const users = db.collection('users');

        const user = await users.findOne({ _id: new ObjectId(decoded.userId) });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Return user without password
        const { password, ...userWithoutPassword } = user;
        res.status(200).json(userWithoutPassword);
    } catch (error) {
        console.error('Profile access error:', error);
        res.status(401).json({ message: 'Invalid or expired token' });
    }
});

export default router;