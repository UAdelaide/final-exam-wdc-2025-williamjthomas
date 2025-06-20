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
                INSERT INTO Users
                (username, email, password_hash, role)
                VALUES
                ('alice123', 'alice@example.com', 'hashed123', 'owner'),
                ('bobwalker', 'bob@example.com', 'hashed456', 'walker'),
                ('carol123', 'carol@example.com', 'hashed789', 'owner'),
                ('jameswalker', 'james@example.com', 'hashed101112', 'walker'),
                ('caroline123', 'caroline@example.com', 'hashed131415', 'owner');
            `);
        }

        [rows] = await db.execute('SELECT COUNT(*) AS count FROM Dogs');
        if (rows[0].count === 0) {
            await db.execute(`
                INSERT INTO Users
                (username, email, password_hash, role)
                VALUES
                ('alice123', 'alice@example.com', 'hashed123', 'owner'),
                ('bobwalker', 'bob@example.com', 'hashed456', 'walker'),
                ('carol123', 'carol@example.com', 'hashed789', 'owner'),
                ('jameswalker', 'james@example.com', 'hashed101112', 'walker'),
                ('caroline123', 'caroline@example.com', 'hashed131415', 'owner');
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
