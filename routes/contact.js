const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Contact Schema and Model
const contactSchema = new mongoose.Schema({
    name: String,
    email: String,
    birthday: Date,
    interest: String,
    chessExperience: String,
    message: String
});

const Contact = mongoose.model('Contact', contactSchema);

// POST - Add Contact
router.post('/', async (req, res) => {
    const { name, email, birthday, interest, chessExperience, message } = req.body;

    try {
        const newContact = new Contact({
            name,
            email,
            birthday,
            interest,
            chessExperience,
            message
        });
        await newContact.save();
        res.status(201).json({ message: 'Contact added successfully' });
    } catch (err) {
        console.error('Error adding contact:', err);
        res.status(500).json({ error: 'Failed to add contact' });
    }
});

// DELETE - Delete contact by name (specific route)
router.delete('/name/:name', async (req, res) => {
    const { name } = req.params;

    try {
        console.log(`Attempting to delete contact with name: ${name}`);
        const deletedContact = await Contact.findOneAndDelete({ name: name });

        if (!deletedContact) {
            console.log(`No contact found with name: ${name}`);
            return res.status(404).json({ error: 'Contact not found' });
        }

        console.log(`Successfully deleted contact: ${name}`);
        res.status(200).json({ message: 'Contact deleted successfully' });
    } catch (err) {
        console.error('Error deleting contact:', err);
        res.status(500).json({ error: 'Failed to delete contact' });
    }
});

// PUT - Update Contact by Name
router.put('/name/:name', async (req, res) => {
    const { name } = req.params;
    const { email, birthday, interest, chessExperience, message } = req.body;

    try {
        console.log(`Updating contact with name: ${name}`);
        const updatedContact = await Contact.findOneAndUpdate(
            { name: name },
            { email, birthday, interest, chessExperience, message },
            { new: true }
        );

        if (!updatedContact) {
            return res.status(404).json({ error: 'Contact not found' });
        }

        res.status(200).json({ message: 'Contact updated successfully', contact: updatedContact });
    } catch (err) {
        console.error('Error updating contact:', err);
        res.status(500).json({ error: 'Failed to update contact' });
    }
});

// GET - Search Contact by Name
router.get('/:name', async (req, res) => {
    const { name } = req.params;

    try {
        console.log(`Searching for contacts with name: ${name}`);
        const contacts = await Contact.find({ name: new RegExp(name, 'i') }); // Case-insensitive search

        console.log(`Found ${contacts.length} contacts`);

        if (contacts.length === 0) {
            // Return a proper JSON response for no results
            return res.status(404).json({ error: 'No contacts found' });
        }

        res.status(200).json(contacts);
    } catch (err) {
        console.error('Error retrieving contacts:', err);
        res.status(500).json({ error: 'Failed to retrieve contacts' });
    }
});

// PUT - Update Contact by ID
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email, birthday, interest, chessExperience, message } = req.body;

    try {
        // Check if id is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid ID format' });
        }

        const updatedContact = await Contact.findByIdAndUpdate(id, {
            name, email, birthday, interest, chessExperience, message
        }, { new: true });

        if (!updatedContact) {
            return res.status(404).json({ error: 'Contact not found' });
        }

        res.status(200).json({ message: 'Contact updated successfully', contact: updatedContact });
    } catch (err) {
        console.error('Error updating contact:', err);
        res.status(500).json({ error: 'Failed to update contact' });
    }
});

// DELETE - Delete Contact by ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Check if id is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid ID format' });
        }

        const deletedContact = await Contact.findByIdAndDelete(id);

        if (!deletedContact) {
            return res.status(404).json({ error: 'Contact not found' });
        }

        res.status(200).json({ message: 'Contact deleted successfully' });
    } catch (err) {
        console.error('Error deleting contact:', err);
        res.status(500).json({ error: 'Failed to delete contact' });
    }
});

module.exports = router;