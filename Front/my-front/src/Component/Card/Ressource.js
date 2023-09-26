import React from 'react';
import '../../Styles/Ressource.css';

export default function Ressource() {
  const cpuUsage = 50; // Replace with the actual CPU usage percentage

  return (
    <div className='ressource-container'>
      <div className='machine-info'>
        <p>VBOX MACHINE</p>
        <p>EMP 23</p>
        <p>Debian</p>
      </div>
      <hr></hr>
      <div className='ressource-info'>
        <p>RAM: 2.00/4.00 Go</p>
        <p>CPU: {cpuUsage}%</p>
        <div className="progress-bar">
          <progress value={cpuUsage} max="100" className="red-bar"></progress>
        </div>
        <p>HDD: 20/34 Go</p>
      </div>
    </div>
  );
}
