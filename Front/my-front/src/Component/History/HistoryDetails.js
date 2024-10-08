import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import '../../Styles/HistoryDetail.css';

export default function HistoryDetails(props) {
  const { rowData } = props;
  const [data, setData] = useState([]);
  const apiUrl = process.env.REACT_APP_API_URL;

  const fetchData = useCallback(() => {
    if (rowData) {
      axios
        .get(`${apiUrl}/history/${rowData.idHistory}`)
        .then((response) => {
          setData(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [apiUrl, rowData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className='history-item-container'>
      {rowData ? (
        <div>
          <div className='machine-section'>
            <h1>{rowData.machineName}</h1>
            <ul>
            <li>OS: {data.nomOS}</li>
            <li>Version OS: {data.versionOS}</li>
            </ul>
          </div>
          <hr />
          <div className='admin-section'>
            <ul>
            <li>Admin: {rowData.admin} ({data.admin})</li>
            </ul>
          </div>
          <hr></hr>
          <div className='user-section'>
            <ul>
            <li>User: {data.userUsername} {data.numEmployee}</li>
            </ul>
          </div>
          <hr></hr>
          <div className='command-section'>
            <ul>
            <li>Command Description: {data.commandDescription}</li>
            <li>Option Description: {rowData.optionDescription}</li>
            </ul>
          </div>
        </div>
      ) : (
        <div className='no-select'>
          <p style={{marginLeft:'25%'}}>No data selected</p>
          <hr></hr>
          <p style={{textAlign:'center'}}>Click on the history you want to check</p>
          </div>
      )}
    </div>
  );
}
