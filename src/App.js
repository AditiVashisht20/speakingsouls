import React from 'react';
import Header from './components/header';
import './App.css';

const appStyle = {
  backgroundImage: 'url("/images/background%20image.jpg")', // URL-encode the space!
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  minHeight: '100vh',
};

function App() {
  return (
    <div className="App" style={appStyle}> {/* ✅ Apply the style here */}
      <Header />
      <section id="home">
        <h1 style={{ color: 'white' }}>Welcome to Speaking Souls</h1>
      </section>
    </div>
  );
}

export default App;
