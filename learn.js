// Import required packages
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const path = require('path');

const app = express();

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: false }));

// Serve static files (like CSS) from the "static" folder
app.use(express.static(path.join(__dirname, 'static')));

// MySQL connection setup
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'sankara@2718',
    database: 'login'
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.log('Error connecting to MySQL:', err.message);
        return;
    }
    console.log('Connected to MySQL database');
});

// Serve the login page (login.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// Handle form submission for registration (sign-up)
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // SQL query to insert the user data into the database
    const sql = 'INSERT INTO users (username, password) VALUES (?, ?)';
    db.execute(sql, [username, hashedPassword], (err, result) => {
        if (err) {
            console.log('Error inserting data:', err.message);
            return res.status(500).send('Error saving data to the database.');
        }

        console.log('User registered successfully');
        res.send('Registration successful!');
    });
});

// Handle login form submission
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // SQL query to find the user by username
    const sql = 'SELECT * FROM users WHERE username = ?';
    db.execute(sql, [username], async (err, results) => {
        if (err) {
            console.log('Error fetching data:', err.message);
            return res.status(500).send('Error fetching data from the database.');
        }

        if (results.length === 0) {
            return res.status(401).send('Invalid username or password');
        }

        const user = results[0];

        // Compare the hashed password with the provided password
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
            res.send('Login successful!');
        } else {
            res.status(401).send('Invalid username or password');
        }
    });
});

// Start the server
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
