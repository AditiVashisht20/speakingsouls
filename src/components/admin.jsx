import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './adminpanel.css';

const AdminPanel = () => {
  const [visibleSection, setVisibleSection] = useState(''); 
  const [bookingData, setBookingData] = useState([]);
  const [eventList, setEventList] = useState([]);

         // const [visibleSection, setVisibleSection] = useState(''); // 'add', 'view', 'list', 'tickets'
          const [tickets, setTickets] = useState([]);

          const fetchTickets = async () => {
  try {
    const res = await fetch('http://localhost:5000/api/reservations');
    const data = await res.json();
    setTickets(data);
  } catch (error) {
    console.error('Error fetching tickets:', error);
    setTickets([]);
  }
};

const showTickets = async () => {
  await fetchTickets();
  setVisibleSection('tickets');
};

  // FETCH BOOKINGS
  const fetchBookingData = async () => {
    try {
      const res = await fetch('http://localhost:5000/admin');
      const jsonData = await res.json();
      setBookingData(jsonData);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setBookingData([]);
    }
  };

  // FETCH EVENTS
  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/events');
      setEventList(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
      alert('Could not fetch events');
    }
  };

  // SECTION HANDLERS
  const showAddEvent = () => {
    setVisibleSection('add');
  };

  const showViewData = async () => {
    await fetchBookingData();
    setVisibleSection('view');
  };

  const showEventList = async () => {
    await fetchEvents();
    setVisibleSection('list');
  };

  return (
    <div style={{ backgroundColor: '#5f637aff', minHeight: '100vh', padding: '20px' }}>
      <h1>Admin Panel</h1>

      <button onClick={showAddEvent} style={{ marginRight: '10px' }}>
        Add Event
      </button>

      <button onClick={showViewData} style={{ marginRight: '10px' }}>
        Contact us queries  
      </button>

      <button onClick={showEventList}>
        Events Listed
      </button>


        <button onClick={showTickets} style={{ marginRight: '10px' }}>
            Tickets Booked
          </button>


{/* SECTION: TICKETS BOOKED */}
{visibleSection === 'tickets' && (
  tickets.length > 0 ? (
    <table className="admin-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Event Name</th>
          <th>Event City</th>
          <th>Event Date</th>
          <th>Name</th>
          <th>Phone</th>
          <th>Date Booked</th>
        </tr>
      </thead>
      <tbody> 
        {tickets.map((ticket, index) => (
          <tr key={index}>
            <td>{ticket.id}</td>
            <td>{ticket.event_name}</td>
            <td>{ticket.event_city}</td>
            <td>{ticket.event_date?.split('T')[0]}</td>
            <td>{ticket.user_name}</td>
            <td>{ticket.phone_number}</td>
            <td>{ticket.date_booked ? ticket.date_booked.split('T')[0] : '-'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    <p style={{ marginTop: '20px' }}>No tickets booked yet.</p>
  )
)}

      {/* SECTION: ADD EVENT FORM */}
      {visibleSection === 'add' && <AddEventForm onSuccess={() => setVisibleSection('list')} />}

      {/* SECTION: VIEW BOOKINGS */}
      {visibleSection === 'view' && (
        bookingData.length > 0 ? (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Contact</th>
                {/* <th>Event Name</th>
                <th>Event Date</th>
                <th>Event City</th> */}
                <th>Message</th>
              </tr>
            </thead>
            <tbody>
              {bookingData.map((entry, index) => (
                <tr key={index}>
                  <td>{entry.name}</td>
                  <td>{entry.email}</td>
                  <td>{entry.contact}</td>
                  {/* <td>{entry.event_name}</td>
                  <td>{entry.event_date?.split('T')[0]}</td>
                  <td>{entry.event_city}</td> */}
                  <td>{entry.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ marginTop: '20px' }}>No bookings found.</p>
        )
      )}

      {/* SECTION: EVENT LIST */}
      {visibleSection === 'list' && (
        eventList.length > 0 ? (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Event Name</th>
                <th>Date</th>
                <th>Venue</th>
                <th>City</th>
                <th>Ticket Price</th>
                <th>Time</th>
                <th>Poster</th>
              </tr>
            </thead>
            <tbody>
              {eventList.map((event, index) => (
                <tr key={index}>
                  <td>{event.event_name}</td>
                  <td>{event.event_date?.split('T')[0]}</td>
                  <td>{event.venue}</td>
                  <td>{event.city}</td>
                  <td>{event.ticket_price}</td>
                  <td>{event.event_time}</td>
                  <td>
                   <a href={event.poster} download>
  Download Poster
</a>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ marginTop: '20px' }}>No events found.</p>
        )
      )}
    </div>
  );
};

// COMPONENT: ADD EVENT FORM
const AddEventForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    eventName: '',
    eventDate: '',
    venue: '',
    city: '',
    ticketPrice: '',
    eventTime: '',
    poster: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    try {
      await axios.post('http://localhost:5000/api/events', data);
      alert('Event added successfully!');
      onSuccess(); // Switch to Event List section after success
    } catch (error) {
      console.error('Error adding event:', error);
      alert('Failed to add event');
    }
  };

  return (
    <form className="event-form" onSubmit={handleSubmit} encType="multipart/form-data">
      <input type="text" name="eventName" placeholder="Event Name" onChange={handleChange} required /><br />
      <input type="date" name="eventDate" onChange={handleChange} required /><br />
      <input type="text" name="venue" placeholder="Venue" onChange={handleChange} required /><br />
      <input type="text" name="city" placeholder="City" onChange={handleChange} required /><br />
      <input type="number" name="ticketPrice" placeholder="Ticket Price" onChange={handleChange} required /><br />
      <input type="time" name="eventTime" onChange={handleChange} required /><br />
      <input type="file" name="poster" accept="image/*" onChange={handleChange} required /><br />
      <button type="submit">Submit Event</button>
    </form>
  );
};




export default AdminPanel;
