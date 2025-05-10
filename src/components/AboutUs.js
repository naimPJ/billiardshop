import React from 'react';
import './AboutUs.css';

const AboutUs = () => {
  return (
    <div className="about-container">
      <div className="about-header">
        <h1>About Us</h1>
        <div className="header-underline"></div>
      </div>
      
      <div className="about-content">
        <div className="about-section">
          <h2>Our Story</h2>
          <p>
            Since 2024, we've been passionate about bringing the highest quality billiard equipment 
            to enthusiasts and professionals alike. Our commitment to excellence has made us a 
            trusted name in the billiards community.
          </p>
        </div>

        <div className="about-section">
          <h2>Our Mission</h2>
          <p>
            To provide premium billiard equipment while delivering exceptional service and expertise 
            to every customer, from beginners to professionals.
          </p>
        </div>

        <div className="about-values">
          <div className="value-card">
            <h3>Quality</h3>
            <p>Only the finest equipment from trusted manufacturers</p>
          </div>
          <div className="value-card">
            <h3>Expertise</h3>
            <p>Professional guidance and support</p>
          </div>
          <div className="value-card">
            <h3>Service</h3>
            <p>Dedicated to customer satisfaction</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs; 