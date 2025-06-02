const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // For JSON parsing

// Serve static files (frontend)
app.use(express.static(path.join(__dirname, '../Exam')));

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'NJD12',
    database: 'student'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL!');
});

// Serve the dashboard
app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '../Exam', 'dashboard.html'));
});

// Handle assessment submission
app.post('/submit-assessment', (req, res) => {
    const { email, score } = req.body;

    const query = 'INSERT INTO assessments (email, score) VALUES (?, ?)';
    db.query(query, [email, score], (err, result) => {
        if (err) {
            console.error('Error saving assessment:', err);
            return res.status(500).send('Database error');
        }
        res.send({ message: 'Assessment submitted successfully!' });
    });
});

// Fetch assessment analytics
app.get('/assessment-data', (req, res) => {
    const query = 'SELECT email, score FROM assessments';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching data:', err);
            return res.status(500).send('Database error');
        }
        res.json(results);
    });
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
