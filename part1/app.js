const express = require('express');
const app = express();
const mysql = require('mysql2/promise');

let db;

(async () => {
    try {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'DogWalkService'
    });
    
}
})


const [rows] = await db.execute('SELECT COUNT(*) AS count FROM books');
    if (rows[0].count === 0) {
      await db.execute(`
        INSERT INTO books (title, author) VALUES
        ('1984', 'George Orwell'),
        ('To Kill a Mockingbird', 'Harper Lee'),
        ('Brave New World', 'Aldous Huxley')
      `);
    }

app.get('/api/dogs', (req, res) => {

});

app.get('/api/walkrequests/open', (req, res) => {

});

app.get('/api/walkers/summary', (req, res) => {

});
