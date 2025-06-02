const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../frontend')));

// MySQL Connection
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

// Serve login page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'login_page.html'));
});

// Handle login
app.post('/login', (req, res) => {
    const { email, name } = req.body;

    const query = 'SELECT * FROM users WHERE email = ? AND name = ?';
    db.query(query, [email, name], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).send('Database error');
        }

        if (results.length > 0) {
            console.log('Login successful:', results[0]);
            res.redirect('Dashboard/dashboard.html'); // Redirect to a dashboard page after successful login
        } else {
            res.send('<h2>Invalid credentials. Please try again.</h2>');
        }
    });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
