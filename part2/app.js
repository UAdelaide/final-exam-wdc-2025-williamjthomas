const express = require('express');
const path = require('path');
require('dotenv').config();
const session = require('express-session');

const app = express();

app.use(session({
    secret: 'secretkeyfromdotenvsoon',
    resave: false,
    saveUninitialized: false,
    
}))

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/public')));

// Routes
const walkRoutes = require('./routes/walkRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/walks', walkRoutes);
app.use('/api/users', userRoutes);

// Export the app instead of listening here
module.exports = app;