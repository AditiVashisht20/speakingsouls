import React, { useState, useEffect } from 'react';
import Header from './components/header';
import './App.css';
import AdminPanel from './components/admin'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
//import React, { useState, useEffect } from 'react';
import axios from 'axios';


  // backgroundImage: 'url("/images/background%20image.jpg")', // URL-encode the space!
  // backgroundSize: 'cover',
  // backgroundPosition: 'center',
  // backgroundRepeat: 'no-repeat',
  // minHeight: '100vh',
 const appStyle = {
  backgroundColor: '#a6c7c7ff', // light yellow
  minHeight: '100vh',
};




function HomePage() {
  const [eventList, setEventList] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/events');
      setEventList(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
      alert('Could not fetch events');
    }
  };

  const openReservePopup = (event) => {
  setSelectedEvent(event);
  setShowPopup(true);
};

const closeReservePopup = () => {
  setShowPopup(false);
  setSelectedEvent(null);
};
 const handleReserve = async(e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value;
    const phone = form.phone.value;

     try {
    const response = await fetch('http://localhost:5000/api/reservations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        event_name: selectedEvent.event_name,
        event_city: selectedEvent.city,
        event_date: selectedEvent.event_date.split('T')[0],
        user_name: name,
        phone_number: phone
        
      })
    });
    console.log('Selected event',selectedEvent);
const data = await response.json();

    if (response.ok) {
      alert(`Seat reserved for ${name} at ${selectedEvent.event_name}!`);
      closeReservePopup();
    } else {
      alert(`Error: ${data.error}`);
    }
  } catch (err) {
    console.error('Error reserving seat:', err);
    alert('Something went wrong. Please try again.');
  }
};

  useEffect(() => {
    fetchEvents();
  }, []);


  return (
    <div className="App" style={appStyle}> {/* ✅ Apply the style here */}
      <Header />
      <section id="home">
        <h1 style={{ color: 'Black' }}>Welcome to Speaking Souls</h1>
      </section>
 <section id="about" className="about-section">
        <div className="about-container">
          <div className="about-text">
            <h2>About Us</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>
          <div className="about-image">
            <img src="/images/about.jpg" alt="About Us" />
          </div>
        </div>
      </section>

      <section id="events">
        <h2 style={{ textAlign: 'center' }}>Upcoming Events</h2>
        <div className="event-tiles-container">
          {eventList.length > 0 ? (
            eventList.map((event, index) => (
              <div
                key={index}
                className="event-card"
                style={{ backgroundImage: `url(${event.poster})` }}
              >
                <div className="overlay">
                  <h3>{event.event_name}</h3>
                  <p>{event.city}</p>
                  < button className='reserve-button' onClick={()=> openReservePopup(event)}>Reserve seat</button>
                </div>
              </div>
            ))
          ) : (
            <p style={{ textAlign: 'center' }}>No events found.</p>
          )}
        </div>
      </section>

{showPopup && selectedEvent && (
        <div className="popup-overlay">
          <div className="popup-content">
            <button className="close-button" onClick={closeReservePopup}>✖</button>
            <h2>Event Name:{selectedEvent.event_name}</h2>
            <p>Date: {selectedEvent.event_date?.split('T')[0]}</p>
            <p>City: {selectedEvent.city}</p>

            <form onSubmit={handleReserve}>
              <input type="text" name="name" placeholder="Your Name"   />
              <input type="text" name="phone" placeholder="Phone Number" required pattern="^\+?\d{1,15}$" />
              <button type="submit">Reserve Seat</button>
            </form>
          </div>
        </div>
      )}

    </div>

    

  );
  
  

  
}
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
}
export default App;
