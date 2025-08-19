import React from 'react';
import Header from './components/header';
import './App.css';
import AdminPanel from './components/admin'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


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
