const express = require('express');
const app = express();
const mysql = require('mysql2/promise');

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
    ((SELECT dog_id FROM Dogs WHERE name = 'Mel'), '2025-06-09 08:15:00', 10, 'Parklands', 'completed');
            `);
        }
    } catch (err) {
        console.error('Error connecting to the database', err);
    }
})();




app.get('/api/dogs', (req, res) => {

});

app.get('/api/walkrequests/open', (req, res) => {

});

app.get('/api/walkers/summary', (req, res) => {

});
