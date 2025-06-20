const express = require('express');
const path = require('path');
require('dotenv').config();

// Routes
const walkRoutes = require('./routes/walkRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({}))
app.use(express.static(path.join(__dirname, '/public')));

app.use('/api/walks', walkRoutes);
app.use('/api/users', userRoutes);

// Export the app instead of listening here
module.exports = app;