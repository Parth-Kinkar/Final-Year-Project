// src/components/Welcome.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import './Welcome.css'; // Import custom CSS

const Welcome = () => {
  return (
    <div className="welcome">
      <header className="navbar">
        <h1 className="title">Project Pulse</h1>
        <nav>
          <Link to="/login" className="nav-button">Login</Link>
          <Link to="/signup" className="nav-button">Sign Up</Link>
        </nav>
      </header>
      <main className="main-content">
        <h2 className="main-title">Welcome to Project Pulse</h2>
        <p className="sub-title">
          Your one-stop platform to showcase projects, connect with peers, faculty, and recruiters. 
          Discover opportunities, collaborate with teammates, and make a mark with your innovative ideas. 
          Transform traditional recruitment with project-based evaluations.
        </p>
        <Link to="/login" className="explore-button">Explore Projects</Link>
      </main>
      <div className="background">
        <div className="light light1"></div>
        <div className="light light2"></div>
        <div className="light light3"></div>
        <div className="light light4"></div>
      </div>
    </div>
  );
};

export default Welcome;
