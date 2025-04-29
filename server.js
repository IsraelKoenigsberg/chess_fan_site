const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const contactRoutes = require('./routes/contact');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/mycontactinfo', contactRoutes);

// MongoDB Connection
mongoose.connect('mongodb+srv://yisraelkoenigsberg:VkhPXBb1J7XAVWv6@cluster0.wbu0e35.mongodb.net/UserInformation?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
    })
    .catch(err => console.error(' MongoDB connection failed:', err));

mongoose.connection.on('connected', () => {
    console.log('MongoDB connected event triggered');
});
mongoose.connection.on('error', err => {
    console.error('MongoDB connection error:', err);
});
