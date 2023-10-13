import React from 'react';
import { useHistory } from 'react-router-dom';
import '../../Styles/CardItem.css';
import up from "../../Utils/icons/uparrow.png";
import down from "../../Utils/icons/downarrow.png";

const CardItem = ({ idOS, machineName, freeRAM, totalRAM, CPUUsage, DownUsage, UpUsage, userUsername, numEmployee, imageUrl, idMachine, state }) => {
  const history = useHistory();
  const stateIndicatorClass = state === 'up' ? 'green-state' : 'red-state';

  const handleClick = () => {
    history.push(`/machine-page/${idMachine}/${idOS}`);
  };

  return (
    <div className="link" onClick={handleClick}>
      <div className="card">
        <img src={imageUrl} alt={machineName} className="card-image" />
        <div className="card-content">
          <h2 className="card-title">{machineName}</h2>
          <p className="card-description">{numEmployee}</p>
          <div className={`state-indicator ${stateIndicatorClass}`}></div>
          <p>RAM : {freeRAM}/{totalRAM}</p>
          <p>CPU : {CPUUsage} </p>
          <p>Internet :<img src={down} className='internet-img' alt="machine" /> {DownUsage} <img src={up} className='internet-img' alt="machine" /> {UpUsage} </p>
        </div>
      </div>
    </div>
  );
};

export default CardItem;
