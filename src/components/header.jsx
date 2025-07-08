import React, { useState } from 'react';
import './header.css';

const Header = () => {
  // return (
  //   <header className="header">
  //     <div className="logo">Speaking Souls</div>
  //     <nav className="nav-links">
  //       <a href="#home">Home</a>
  //       <a href="#about">About Us</a>
  //       <button className="book-btn">Book Event</button>
  //     </nav>
  //   </header>
  // )
const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact: '',
    event_name: '',
    event_date: '',
    event_city: '',
    message: '',
  });
const toggleForm = () => {
  console.log("Form visibility before toggle:", showForm);
  setShowForm(!showForm);
};


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await res.text();
      alert(result);
      setShowForm(false);
      setFormData({
        name: '',
        email: '',
        contact: '',
        event_name: '',
        event_date: '',
        event_city: '',
        message: '',
      });
    } catch (err) {
      console.error(err);
      alert('Failed to submit booking.');
    }
  };

  return (
    <>
      <header className="header">
        <div className="logo">SpeakingSouls</div>
        <nav className="nav-links">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <button className="book-btn" onClick={toggleForm}>Book Event</button>
        </nav>
      </header>

      {showForm && (
        <div className="modal">
          <div className="form-popup">
            <span className="close-btn" onClick={toggleForm}>&times;</span>
            <h2>Book Your Event</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <input
                type="tel"
                name="contact"
                placeholder="Contact Number"
                 pattern="[0-9]{10}"
                maxLength="10"
                value={formData.contact}
                onChange={handleChange}
                required
                title="Phone number is invalid"
              />
              <input
                type="text"
                name="event_name"
                placeholder="Event Name"
                value={formData.event_name}
                onChange={handleChange}
                required
              />
              <input
                type="date"
                name="event_date"
                value={formData.event_date}
                onChange={handleChange}
                 min={new Date().toISOString().split("T")[0]}
                 title="Please select today or a future date"

                required
              />
              <input
                type="text"
                name="event_city"
                placeholder="Event City"
                value={formData.event_city}
                onChange={handleChange}
                required
              />
              <textarea
                name="message"
                placeholder="Message"
                value={formData.message}
                onChange={handleChange}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button type="submit">Submit</button>
                <button type="button" className="cancel-btn" onClick={toggleForm}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>


  );
};

export default Header;
