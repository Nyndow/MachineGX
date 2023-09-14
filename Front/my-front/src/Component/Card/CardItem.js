import React from 'react';
import '../../Styles/CardItem.css'

const CardItem = ({ title, description, imageUrl }) => {
  return (
    <div className="card">
      <img src={imageUrl} alt={title} className="card-image" />
      <div className="card-content">
        <h2 className="card-title">{title}</h2>
        <p className="card-description">{description}</p>
        <ul>
          <li>RAM : </li>
          <li>CPU : </li>
          <li>Download : </li>
        </ul>
      </div>
    </div>
  );
};

export default CardItem;
