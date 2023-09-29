import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../Styles/HistoryDetail.css';

export default function HistoryDetails(props) {
  const { rowData } = props;
  const [data, setData] = useState([]); 
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    if (rowData) {
      axios
        .get(`${apiUrl}/historyy/${rowData.idHistory}`)
        .then((response) => {
          setData(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <div className='history-item-container'>
      {rowData ? (
        <div>
          HistoryDetails for id: {rowData.idHistory}
          <hr />
          <div>Admin: {rowData.admin}</div>
          <div>Machine Name: {rowData.machineName}</div>
          <div>Option Description: {rowData.optionDescription}</div>
        </div>
      ) : (
        <div>No data selected</div>
      )}
    </div>
  );
}
