import React from 'react';
import { Link } from 'react-router-dom';
import '../Styles/NotFound.css';

const NotFound = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1 className="not-found-header">404</h1>
        <p className="not-found-message">Oops! The page you're looking for could not be found.</p>
        <Link to="/" className="back-to-home-link">Go Back to Home</Link>
      </div>
    </div>
  );
};

export default NotFound;
