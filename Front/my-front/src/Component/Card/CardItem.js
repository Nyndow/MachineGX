import React from 'react';
import { useHistory } from 'react-router-dom';
import '../../Styles/CardItem.css';
import up from "../../Utils/icons/uparrow.png";
import down from "../../Utils/icons/downarrow.png";

const CardItem = ({ idOS, machineName, freeRAM, totalRAM, CPUUsage, DownUsage, UpUsage, userUsername, numEmployee, imageUrl, idMachine, state, idUser }) => {
  const history = useHistory();
  const stateIndicatorClass = state ? 'green-state' : 'red-state';

  const handleClick = () => {
    history.push(`/machine-page/${idMachine}/${idOS}?idUser=${idUser}`);
  };

  const cpuUsageStyle = {
    color: CPUUsage > 50 ? 'red' : 'inherit',
  };

  return (
    <div onClick={handleClick}>
      <div className="card">
        <div className="card-content">
          <h3 className="card-title">{machineName} | {numEmployee}</h3>
          <div className='os-image'>
            <div className={`state-indicator ${stateIndicatorClass}`}></div>
            <img src={require(`../../Utils/distro-pics/${imageUrl}`)} alt={machineName} className="card-image" />
          </div>
          <p>RAM: {freeRAM}/{totalRAM} GB</p>
          <p style={cpuUsageStyle}>CPU: {CPUUsage} % </p>
          <p>Internet:
            <img src={up} className='internet-img' alt="machine" /> {DownUsage}
            <img src={down} className='internet-img' alt="machine" /> {UpUsage}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CardItem;
