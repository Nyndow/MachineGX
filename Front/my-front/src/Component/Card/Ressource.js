import React, { useState, useEffect } from 'react';
import '../../Styles/Ressource.css';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import axios from 'axios';

export default function Ressource({ idUser }) {

  const [data, setData] = useState({
    CPUUsage: 0,
    UsedMemory: 0,
    TotalMemory: 0,
  });

  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {

    // Fetch data every 2 seconds
    const intervalId = setInterval(() => {
      fetchData();
    }, 2000);

    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, [idUser, apiUrl]);

  const fetchData = () => {
    axios
      .get(`${apiUrl}/execute-cpu/${idUser}`)
      .then((response) => {
        console.log("Original CPUUsage:", response.data.CPUUsage);
  
        // Corrected the update of CPUUsage
        const updatedCPUUsage = response.data.CPUUsage > 90 ? 100 : response.data.CPUUsage;
        
        // Corrected the condition to check if updatedCPUUsage is less than 0
        const finalCPUUsage = updatedCPUUsage < 0 ? 0.5 : updatedCPUUsage;
  
        setData({
          ...response.data,
          CPUUsage: finalCPUUsage,
        });
      })
      .catch(() => {});
  };
  
  

  return (
    <div className='ressource-container'>
      <div className='machine-info'>
        <p>VBOX MACHINE</p>
        <p>EMP 23</p>
        <p>Debian</p>
      </div>
      <hr></hr>
      <div className='ressource-info'>
        <div className="RAM-bar">
          <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress variant="determinate" size={200} value={(data.UsedMemory / data.TotalMemory) * 100} />
            <Box
              sx={{
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography variant="caption" component="div" color="text.secondary">
                RAM : {`${Math.round((data.UsedMemory / data.TotalMemory) * 100)}%`}
              </Typography>
            </Box>
          </Box>
        </div>
        <div className="CPU-bar">
          <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress variant="determinate" color="secondary" size={200} value={data.CPUUsage} />
            <Box
              sx={{
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography variant="caption" component="div" color="text.secondary">
                CPU : {`${Math.round(data.CPUUsage)}%`}
              </Typography>
            </Box>
          </Box>
        </div>
      </div>
    </div>
  );
}
