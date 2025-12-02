import React from 'react';
import './Footer.css';

const Footer = () => (
  <footer className="fb-footer">
    <div className="fb-footer-grid">
      <div>
        <h4>Fresh Basket</h4>
        <p>
          Online fruit & vegetable marketplace connecting you with trusted local
          vendors.
        </p>
      </div>
      <div>
        <h5>Useful Pages</h5>
        <ul>
          <li>About</li>
          <li>Shop</li>
          <li>Profile</li>
        </ul>
      </div>
      <div>
        <h5>Help Center</h5>
        <ul>
          <li>Contact</li>
          <li>Support</li>
          <li>FAQs</li>
        </ul>
      </div>
    </div>
    <p className="fb-footer-copy">
      © 2025 Fresh Basket. All rights reserved.
    </p>
  </footer>
);

export default Footer;
