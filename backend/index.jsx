const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456', // ⚠️ Replace with your MySQL password
  database: 'event_db'            // ⚠️ Ensure this database exists
});

db.connect((err) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
  } else {
    console.log('✅ Connected to MySQL database!');
  }
});

// Submit Booking Route
app.post('/submit', (req, res) => {
  const { name, email, contact, event_name, event_date, event_city, message } = req.body;

  const query = `
    INSERT INTO bookings (name, email, contact, event_name, event_date, event_city, message)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [name, email, contact, event_name, event_date, event_city, message],
    (err, result) => {
      if (err) {
        console.error('❌ Insert error:', err.message);
        res.status(500).send('Failed to save booking');
      } else {
        res.status(200).send('✅ Booking saved successfully!');
      }
    }
  );
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
