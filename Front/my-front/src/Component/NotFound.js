import React from 'react';
import { Link } from 'react-router-dom';
import '../Styles/NotFound.css';

const NotFound = () => {
  return (
    <div className="not-found-container">
      <h1 className="not-found-header">404</h1>
      <p className="not-found-message">The page you are looking for does not exist.</p>
      <Link to="/home" className="back-to-home-link">Go Back to Home</Link>
    </div>
  );
};

export default NotFound;
