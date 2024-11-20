import React from 'react';
import { Link } from 'react-router-dom';
import './FrontPage.css';
import logo from '../../images/logo.jpg'; // Replace with your actual logo path

function FrontPage() {
  return (
    <div className="front-page">
      {/* Banner Section */}
      <div className="banner">
        <div className="banner-content">
          <img src={logo} alt="Furr & Purr Logo" className="banner-logo" />
          <h1>Welcome to Furr & Purr</h1>
          <p>Your one-stop shop for all things cats and dogs!</p>
          <div className="banner-buttons">
            <Link to="/shop" className="btn btn-primary">Shop Now</Link>
            <Link to="/about" className="btn btn-secondary">Learn More</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FrontPage;
