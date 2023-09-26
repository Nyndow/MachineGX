import React from 'react';
import '../../Styles/CardItem.css';
import { Link } from 'react-router-dom/cjs/react-router-dom';

const CardItem = ({ machineName,freeRAM,totalRAM,CPUUsage,DownUsage,UpUsage,userUsername, numEmployee, imageUrl, idMachine, state }) => {
  const stateIndicatorClass = state === 'up' ? 'green-state' : 'red-state';

  return (
    <Link to={`/machine-page/${idMachine}`} className="link">
      <div className="card">
        <img src={imageUrl} alt={machineName} className="card-image" />
        <div className="card-content">
          <h2 className="card-title">{machineName}</h2>
          <p className="card-description">{numEmployee}</p>
          <div className={`state-indicator ${stateIndicatorClass}`}></div>
            <p>RAM : {freeRAM}/{totalRAM}</p>
            <p>CPU : {CPUUsage} </p>
            <p>Download : {DownUsage} </p>
            <p>Upload : {UpUsage} </p>
        </div>
      </div>
    </Link>
  );
};

export default CardItem;