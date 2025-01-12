import React from 'react';
import './AppFooter.css';

const Footer = () => {
  return (
    <footer className="dern-footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>About Dern Support</h3>
          <p>Providing top-notch support solutions for businesses worldwide.</p>
        </div>
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/support-request-management">Support</a></li>
            <li><a href="/knowledge-base">Knowledge Base</a></li>
            <li><a href="/contact">Contact Us</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Contact Info</h3>
          <p>Email: support@dernsupport.com</p>
          <p>Phone: (555) 123-4567</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 Dern Support. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;