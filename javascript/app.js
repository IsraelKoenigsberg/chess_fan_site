const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Contact = require('./models/userModel');

const app = express();
const cors = require('cors');
app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// Connect to MongoDB
mongoose.connect('mongodb+srv://yisraelkoenigsberg:VkhPXBb1J7XAVWv6@cluster0.wbu0e35.mongodb.net/UserInformation?retryWrites=true&w=majority')
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Error connecting to MongoDB:', err));

// Handle form submission
app.post('/contact', (req, res) => {
    const { name, email, birthday, interest, 'chess-experience': chessExperience, message } = req.body;

    const newContact = new Contact({
        name,
        email,
        birthday,
        interest,
        chessExperience,
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
// GET contact by name
app.get('/contact/:name', (req, res) => {
    const nameToFind = req.params.name;

    Contact.find({ name: nameToFind })
        .then((results) => {
            res.status(200).json(results);
        })
        .catch((err) => {
            console.error('Error fetching contact:', err);
            res.status(500).send('Error retrieving contact');
        });
});
// DELETE contact by name (delete the first match)
app.delete('/contact/:name', (req, res) => {
    const nameToDelete = req.params.name;

    Contact.findOneAndDelete({ name: nameToDelete })
        .then((deletedDoc) => {
            if (!deletedDoc) {
                return res.status(404).send('No contact found with that name.');
            }
            res.status(200).send('Contact deleted successfully.');
        })
        .catch((err) => {
            console.error('Error deleting contact:', err);
            res.status(500).send('Error deleting contact');
        });
});


// Start server
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
