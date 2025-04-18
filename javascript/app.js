const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Contact = require('./models/userModel');

const app = express();

// Set up body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// Connect to MongoDB (replace with your Atlas URL if needed)
mongoose.connect('mongodb+srv://yisraelkoenigsberg:VkhPXBb1J7XAVWv6@cluster0.wbu0e35.mongodb.net/UserInformation?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Error connecting to MongoDB:', err));

// Endpoint to handle form submission
app.post('/testdb', (req, res) => {
    const { name, email, message } = req.body;

    const newContact = new Contact({
        name,
        email,
        message
    });

    newContact.save()
        .then(() => {
            res.status(200).send('Form submitted successfully!');
        })
        .catch((err) => {
            console.error('Error saving contact:', err);
            res.status(500).send('Error submitting form');
        });
});

// Start the server
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});