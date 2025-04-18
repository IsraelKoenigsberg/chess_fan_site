const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    birthday: { type: Date },
    interest: { type: String },
    chessExperience: { type: String },
    message: { type: String, required: true }
});

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
