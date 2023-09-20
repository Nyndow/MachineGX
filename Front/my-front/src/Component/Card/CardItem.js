import React from 'react';
import '../../Styles/CardItem.css';
import { Link } from 'react-router-dom/cjs/react-router-dom';

const CardItem = ({ title, description, imageUrl, idMachine, state }) => {
  const stateIndicatorClass = state === 'up' ? 'green-state' : 'red-state';

  return (
    <Link to={`/machineList/${idMachine}`} className="link">
      <div className="card">
        <img src={imageUrl} alt={title} className="card-image" />
        <div className="card-content">
          <h2 className="card-title">{title}</h2>
          <p className="card-description">{description}</p>
          <div className={`state-indicator ${stateIndicatorClass}`}></div>
          <ul>
            <li>RAM : </li>
            <li>CPU : </li>
            <li>Download : </li>
          </ul>
        </div>
      </div>
    </Link>
  );
};

export default CardItem;
