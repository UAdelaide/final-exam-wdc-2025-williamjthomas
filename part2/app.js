const express = require('express');
const path = require('path');
require('dotenv').config();
const session = require('express-session');
const cors = require('cors');

const app = express();

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 1000 * 60 * 60
    }
}));

app.use(cors());

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '/public')));

// Routes
const walkRoutes = require('./routes/walkRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/walks', walkRoutes);
app.use('/api/users', userRoutes);

app.get('/api/dogs', async (req, res) => {
    try {
        const [dogs] = await db.execute("SELECT dog_id, name, size, owner_id FROM Dogs");
        res.json(dogs);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch dogs' });
    }
});

// Export the app instead of listening here
module.exports = app;