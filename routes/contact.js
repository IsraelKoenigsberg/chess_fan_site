const express = require('express');
const router = express.Router();
const Contact = require('../models/contactmodel');
const cors = require('cors');

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
        res.status(500).json({ error: 'Failed to add contact' });
    }
});

// GET - Search Contact by Name
router.get('/:name', async (req, res) => {
    const { name } = req.params;

    try {
        const contacts = await Contact.find({ name: new RegExp(name, 'i') }); // Case-insensitive search
        res.status(200).json(contacts);
    } catch (err) {
        res.status(500).json({ error: 'Failed to retrieve contacts' });
    }
});

// PUT - Update Contact by ID
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email, birthday, interest, chessExperience, message } = req.body;

    try {
        const updatedContact = await Contact.findByIdAndUpdate(id, {
            name, email, birthday, interest, chessExperience, message
        }, { new: true });

        if (!updatedContact) {
            return res.status(404).json({ error: 'Contact not found' });
        }

        res.status(200).json({ message: 'Contact updated successfully', contact: updatedContact });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update contact' });
    }
});

// PUT - Update Contact by Name
router.put('/name/:name', async (req, res) => {
    const { name } = req.params;
    const { email, birthday, interest, chessExperience, message } = req.body;

    try {
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
        res.status(500).json({ error: 'Failed to update contact' });
    }
});

// DELETE - Delete Contact by ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedContact = await Contact.findByIdAndDelete(id);

        if (!deletedContact) {
            return res.status(404).json({ error: 'Contact not found' });
        }

        res.status(200).json({ message: 'Contact deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete contact' });
    }
});


// DELETE - Delete Contact by Name
router.delete('/name/:name', async (req, res) => {
    const { name } = req.params;

    try {
        const deletedContact = await Contact.findOneAndDelete({ name: name });

        if (!deletedContact) {
            return res.status(404).json({ error: 'Contact not found' });
        }

        res.status(200).json({ message: 'Contact deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete contact' });
    }
});
module.exports = router;
