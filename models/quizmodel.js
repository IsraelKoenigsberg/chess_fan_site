const mongoose = require('mongoose');

const QuizResultSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        index: true
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        required: true
    },
    totalQuestions: {
        type: Number,
        required: true
    },
    percentage: {
        type: Number,
        required: true
    },
    answers: {
        type: Array,
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: true // Add index for sorting by date
    }
}, { timestamps: true });

QuizResultSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('QuizResult', QuizResultSchema);