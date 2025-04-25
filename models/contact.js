const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: String,
    birthday: Date,
    interest: String,
    chessExperience: String,
    message: String
});

module.exports = mongoose.model('Contact', contactSchema);
