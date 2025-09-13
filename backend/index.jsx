const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
//const posterPath = req.file.filename; // instead of `/uploads/...`
const app = express();
const port = 5000;
const multer = require('multer');
const path = require('path');

// Set storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Folder where images will be storedss
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Rename with timestamp
  },
});

const upload = multer({ storage });

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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
    INSERT INTO bookings (name, email, contact, message)
    VALUES (?, ?, ?, ?)
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

app.get('/admin', (req, res) => {
  const query = 'SELECT * FROM bookings';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      res.status(500).send('Server error');
    } else {
      res.json(results);
    }
  });
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});

app.post('/api/events', upload.single('poster'), (req, res) => {
  const { eventName, eventDate, venue, city, ticketPrice, eventTime } = req.body;
  const posterPath = req.file.filename;

  const sql = `INSERT INTO events (event_name, event_date, venue, city, ticket_price, event_time, poster) 
               VALUES (?, ?, ?, ?, ?, ?, ?)`;

  const values = [eventName, eventDate, venue, city, ticketPrice, eventTime, posterPath];

  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ message: 'Event added successfully' });
  });
});
// Fetch all events
app.get('/api/events', (req, res) => {
  db.query('SELECT * FROM events', (err, results) => {
    if (err) {
      console.error('Error fetching events:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    // console.log("Raw DB Results:", results)
//     res.json(results);
//   });
// });

const events = results.map(event => {
  let filename=event.poster;
  if(filename.startsWith("uploads/"))
  {
    filename=filename.replace("/uploads/", "");
  }
   else if (filename.startsWith("/uploads/")) {
        filename = filename.replace("/uploads/", "");
      }


    // console.log("After fix poster:", filename); 
return {

      ...event,
      poster: `http://localhost:${port}/uploads/${filename}`
    };
  });

// console.log("Final Events Sent:", events);
    res.json(events);
});
});


  app.post('/api/reservations', (req, res) => {
    console.log('Reservation route hit');

    console.log('Request body:', req.body);
      const { event_name, event_city, event_date, user_name, phone_number } = req.body;
        

      const sql = `
          INSERT INTO reservations (event_name, event_city, event_date, user_name, phone_number)
          VALUES (?, ?, ?, ?, ?)
      `;

      const values = [event_name, event_city, event_date, user_name, phone_number];

      db.query(sql, values, (err, result) => {
          if (err) {
              console.error('Error saving reservation:', err);
              return res.status(500).json({ error: 'Database error' });
          }
          res.status(200).json({ message: 'Reservation saved successfully' });
      });
  });


  app.get('/api/reservations', (req, res) => {
    const sql = `SELECT * FROM reservations ORDER BY id DESC`;

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching reservations:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        console.log('Fetched reservations from front end', results);  
        res.json(results);
    });
});