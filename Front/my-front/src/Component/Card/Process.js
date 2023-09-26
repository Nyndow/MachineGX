import React, { useEffect, useState } from 'react';
import '../../Styles/Process.css';
import axios from 'axios';

export default function Process({ idMachine }) {
  const [dataToDisplay, setDataToDisplay] = useState({});
  const apiUrl = process.env.REACT_APP_API_URL;
  const columns = ['User', 'CPU Usage', 'Memory Usage', 'Program'];

  useEffect(() => {
    fetchData();

    const intervalId = setInterval(fetchData, 2000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const fetchData = () => {
    axios
      .get(`${apiUrl}/top/${idMachine}`)
      .then((response) => {
        const dataWithPIDAsKey = {};
        response.data.forEach((rowData) => {
          dataWithPIDAsKey[rowData.PID] = rowData;
        });
        setDataToDisplay(dataWithPIDAsKey);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  };

  const handleStop = (rowData) => {
    axios.
    post(`${apiUrl}/top/${idMachine}/${rowData.PID}`)
    .then(
      console.log('Stopping the program', rowData.Program)
    )
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
  };

  return (
    <div className='process-container'>
      <table className='process-table'>
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index}>{column}</th>
            ))}
            <th></th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(dataToDisplay).map((pid) => (
            <tr key={pid} className='process-table-row-even'>
              {columns.map((column, columnIndex) => (
                <td key={columnIndex}>{dataToDisplay[pid][column]}</td>
              ))}
              <td>
                <button
                  className='stop-button'
                  onClick={() => handleStop(dataToDisplay[pid])}
                >
                  Stop
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
