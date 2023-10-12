import React, { useState, useEffect } from 'react';
import '../../Styles/Ressource.css';
import LinearProgressWithLabel from '@mui/material/LinearProgress';
import CircularProgressWithLabel from '@mui/material/CircularProgress'

export default function Ressource() {
  const [cpuUsage, setCpuUsage] = useState(20);
  const [ramUsage, setRamUsage] = useState(25);
  const [diskUsage, setDiskUsage] = useState(59);

  useEffect(() => {
    const interval = setInterval(() => {
      setCpuUsage(Math.random() * 100);
      setRamUsage(Math.random() * 100);
      setDiskUsage(Math.random() * 100);
    }, 2000); 

    return () => clearInterval(interval);
  }, []);

  return (
    <div className='ressource-container'>
      <div className='machine-info'>
        <p>VBOX MACHINE</p>
        <p>EMP 23</p>
        <p>Debian</p>
      </div>
      <hr></hr>
      <div className='ressource-info'>
        <div className="disk-bar">
          <p>DISK:</p>
          <LinearProgressWithLabel color="secondary" variant="determinate" value={diskUsage} />
        </div>
        <div className="RAM-bar">
          <p>RAM:</p>
          <LinearProgressWithLabel color="secondary" variant="determinate" value={ramUsage} />
        </div>
        <div className="CPU-bar">
          <p>CPU:</p>
          <CircularProgressWithLabel color="secondary" variant="determinate" value={cpuUsage} />
        </div>
        <p>HDD: 20/34 Go</p>
      </div>

      <button className='clear-cache'>clear</button>
    </div>
  );
}
