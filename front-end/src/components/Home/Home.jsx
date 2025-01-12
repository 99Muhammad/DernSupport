import React from 'react';
import './AppHome.css';

const Home = () => {
  return (
    <div className="home-background">
      <h1 className="home-title">Welcome to Alpha Support Management System</h1>
      <p className="home-description">Here you can manage and track support tickets efficiently.</p>
      
      <h2>Key Features:</h2>
      <ul className="feature-list">
        <li className="feature-item">✅ Ticket Management</li>
        <li className="feature-item">✅ Customer Communication</li>
        <li className="feature-item">✅ Performance Analytics</li>
        <li className="feature-item">✅ Team Collaboration</li>
      </ul>
    </div>
  );
};

export default Home;