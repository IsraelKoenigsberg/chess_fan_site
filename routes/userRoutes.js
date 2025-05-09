const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/loginmodel');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

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

        // Check if user already exists
        console.log('Checking if user already exists...');
        const existingUser = await User.findOne({
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
        const newUser = new User({
            firstname,
            lastname,
            username,
            email,
            password: hashedPassword
        });

        // Insert user into database
        console.log('Inserting new user into database...');
        await newUser.save();
        console.log('User inserted successfully');

        // Convert to object to remove password
        const userObject = newUser.toObject();
        delete userObject.password;

        console.log('Registration successful for user:', username);
        res.status(201).json({
            message: 'User created successfully',
            user: userObject
        });
    } catch (error) {
        console.error('Registration error details:');
        console.error(`Error Name: ${error.name}`);
        console.error(`Error Message: ${error.message}`);
        console.error(`Error Stack: ${error.stack}`);
        res.status(500).json({
            message: 'Server error during registration'
        });
    }
});

// User login
router.post('/login', async (req, res) => {
    console.log('Login endpoint called');
    try {
        const { username, password } = req.body;

        console.log('Login attempt for username:', username);

        // Input validation
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        // Find user by username
        const user = await User.findOne({ username });

        if (!user) {
            console.log('Login failed: User not found');
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            console.log('Login failed: Invalid password');
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id.toString() },
            JWT_SECRET,
            { expiresIn: '24h' } // 24 hour expiration
        );

        console.log('Login successful for user:', username);
        console.log('Token generated. First 20 chars:', token.substring(0, 20) + '...');

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

        try {
            const decoded = jwt.verify(token, JWT_SECRET);

            const user = await User.findById(decoded.userId);

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Convert to object to remove password
            const userObject = user.toObject();
            delete userObject.password;

            res.status(200).json(userObject);
        } catch (jwtError) {
            console.error('JWT verification error:', jwtError);
            return res.status(401).json({ message: 'Invalid or expired token' });
        }
    } catch (error) {
        console.error('Profile access error:', error);
        res.status(401).json({ message: 'Invalid or expired token' });
    }
});

module.exports = router;