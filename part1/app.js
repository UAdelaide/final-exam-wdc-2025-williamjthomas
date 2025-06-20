var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require('mysql2/promise');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

let db;

(async () => {
    try {
        db = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'DogWalkService'
        });

        const [UsersRows] = await db.execute('SELECT COUNT(*) AS count FROM Users');
        if (UsersRows[0].count === 0) {
            await db.execute(`
                INSERT INTO Users (username, email, password_hash, role)
                VALUES
                ('alice123', 'alice@example.com', 'hashed123', 'owner'),
                ('bobwalker', 'bob@example.com', 'hashed456', 'walker'),
                ('carol123', 'carol@example.com', 'hashed789', 'owner'),
                ('jameswalker', 'james@example.com', 'hashed101112', 'walker'),
                ('caroline123', 'caroline@example.com', 'hashed131415', 'owner');
            `);
        }

        const [DogsRows] = await db.execute('SELECT COUNT(*) AS count FROM Dogs');
        if (DogsRows[0].count === 0) {
            await db.execute(`
                INSERT INTO Dogs (owner_id, name, size)
                VALUES
                ((SELECT user_id FROM Users WHERE username = 'alice123'), 'Max', 'medium'),
                ((SELECT user_id FROM Users WHERE username = 'carol123'), 'Bella', 'small'),
                ((SELECT user_id FROM Users WHERE username = 'caroline123'), 'Toby', 'large'),
                ((SELECT user_id FROM Users WHERE username = 'caroline123'), 'Sam', 'medium'),
                ((SELECT user_id FROM Users WHERE username = 'alice123'), 'Mel', 'small');
            `);
        }

        const [WalkRequestsRows] = await db.execute('SELECT COUNT(*) AS count FROM WalkRequests');
        if (WalkRequestsRows[0].count === 0) {
            await db.execute(`
                INSERT INTO WalkRequests (dog_id, requested_time, duration_minutes, location, status)
                VALUES
                ((SELECT dog_id FROM Dogs WHERE name = 'Max'), '2025-06-10 08:00:00', 30, 'Parklands', 'open'),
                ((SELECT dog_id FROM Dogs WHERE name = 'Bella'), '2025-06-10 09:30:00', 45, 'Beachside Ave', 'accepted'),
                ((SELECT dog_id FROM Dogs WHERE name = 'Toby'), '2025-06-11 10:15:00', 20, 'Adelaide CBD', 'cancelled'),
                ((SELECT dog_id FROM Dogs WHERE name = 'Sam'), '2025-06-11 10:25:00', 30, 'Adelaide CBD', 'open'),
                ((SELECT dog_id FROM Dogs WHERE name = 'Mel'), '2025-06-09 08:15:00', 10, 'Parklands', 'completed'),
                ((SELECT dog_id FROM Dogs WHERE name = 'Max'), '2025-06-13 09:15:00', 40, 'Adelaide Showgrounds', 'completed');
            `);
        }

        const [WalkApplicationsRows] = await db.execute('SELECT COUNT(*) AS count FROM WalkApplications');
        if (WalkApplicationsRows[0].count === 0) {
            await db.execute(`
                INSERT INTO WalkApplications (request_id, walker_id, status)
                VALUES
                ((SELECT request_id FROM WalkRequests WHERE duration_minutes = 10), (SELECT user_id FROM Users WHERE username = 'bobwalker'), 'accepted'),
                ((SELECT request_id FROM WalkRequests WHERE duration_minutes = 40), (SELECT user_id FROM Users WHERE username = 'bobwalker'), 'accepted');
            `);
        }

        const [WalkRatingsRows] = await db.execute('SELECT COUNT(*) AS count FROM WalkRatings');
        if (WalkRatingsRows[0].count === 0) {
            await db.execute(`
                INSERT INTO WalkRatings (request_id, walker_id, owner_id, rating, comments)
                VALUES
                (SELECT request_id FROM WalkRequests WHERE duration_minutes = 10), (SELECT user_id FROM Users WHERE username = 'bobwalker'), 
                `);
        }
    } catch (err) {
        console.error('An error occurred:', err);
    }
})();

app.get('/api/dogs', async (req, res) => {
    try {
        const [dogs] = await db.execute("SELECT d.name AS dog_name, d.size, u.username AS owner_username FROM Dogs d JOIN Users u ON d.owner_id = u.user_id");
        res.json(dogs);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch dogs' });
    }
});

app.get('/api/walkrequests/open', async (req, res) => {
    try {
        const [walkRequests] = await db.execute("SELECT wr.request_id, d.name AS dog_name, wr.requested_time, wr.duration_minutes, wr.location, u.username AS owner_username FROM WalkRequests wr JOIN Dogs d ON wr.dog_id = d.dog_id JOIN Users u ON d.owner_id = u.user_id WHERE wr.status = 'open'");
        res.json(walkRequests);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch walk requests' });
    }
});

/*
app.get('/api/walkers/summary', async (req, res) => {

});
*/

module.exports = app;
