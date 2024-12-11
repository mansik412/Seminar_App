// server.js
const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create a new express app
const app = express();

// Set up bodyParser to handle JSON and form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (HTML, CSS, JS)
app.use(express.static('public'));

// Connect to SQLite database
const db = new sqlite3.Database('./seminar.db', (err) => {
    if (err) {
        console.error("Error opening database:", err.message);
    } else {
        console.log('Connected to the SQLite database.');
        // Create the "questions" table if it doesn't exist
        db.run(`CREATE TABLE IF NOT EXISTS questions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            question TEXT NOT NULL,
            submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);
    }
});

// Route to delete all questions from the database
app.delete('/delete-all-questions', (req, res) => {
    const deleteQuery = 'DELETE FROM questions';  // SQL to delete all records

    db.run(deleteQuery, function(err) {
        if (err) {
            return res.status(500).json({ success: false, error: err.message });
        }
        return res.json({ success: true });
    });
});

// API to submit a question (POST request)
app.post('/submit-question', (req, res) => {
    const { question } = req.body;
    const query = 'INSERT INTO questions (question, approved, answered) VALUES (?, 0, 0)';

    db.run(query, [question], function(err) {
        if (err) {
            return res.status(500).json({ success: false, error: err.message });
        }
        res.json({ success: true });
    });
});

// API to get unapproved questions (GET request)
app.get('/unapproved-questions', (req, res) => {
    db.all(`SELECT * FROM questions WHERE approved = 0 ORDER BY submitted_at DESC`, [], (err, rows) => {
        if (err) {
            return res.json({ success: false, error: err.message });
        }
        return res.json(rows);
    });
});

// API to approve or reject a question (POST request)
app.post('/manage-question', (req, res) => {
    const { id, approve } = req.body;
    const query = 'UPDATE questions SET approved = ? WHERE id = ?';

    db.run(query, [approve, id], function(err) {
        if (err) {
            return res.status(500).json({ success: false, error: err.message });
        }
        res.json({ success: true });
    });
});

// API to get approved and unanswered questions (GET request)
app.get('/get-questions', (req, res) => {
    db.all(`SELECT * FROM questions WHERE approved = 1 AND answered = 0 ORDER BY submitted_at DESC`, [], (err, rows) => {
        if (err) {
            return res.json({ success: false, error: err.message });
        }
        return res.json(rows);
    });
});

// API to get all questions (GET request)
app.get('/all-questions', (req, res) => {
    db.all(`SELECT * FROM questions ORDER BY submitted_at DESC`, [], (err, rows) => {
        if (err) {
            return res.json({ success: false, error: err.message });
        }
        return res.json(rows);  // Send all questions (approved and unapproved)
    });
});

// API to mark a question as answered (POST request)
app.post('/mark-as-answered', (req, res) => {
    const { id } = req.body;

    if (id) {
        db.run(`UPDATE questions SET answered = 1 WHERE id = ?`, [id], function(err) {
            if (err) {
                return res.json({ success: false, error: err.message });
            }
            return res.json({ success: true });
        });
    } else {
        res.json({ success: false, message: 'Invalid input' });
    }
});

// API to mark a question as unanswered (POST request)
app.post('/mark-as-unanswered', (req, res) => {
    const { id } = req.body;

    if (id) {
        db.run(`UPDATE questions SET answered = 0 WHERE id = ?`, [id], function(err) {
            if (err) {
                return res.json({ success: false, error: err.message });
            }
            return res.json({ success: true });
        });
    } else {
        res.json({ success: false, message: 'Invalid input' });
    }
});




// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


