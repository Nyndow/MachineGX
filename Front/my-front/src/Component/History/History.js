import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../Styles/History.css';
import HistoryDetails from './HistoryDetails';

export default function History() {
  const [dataToDisplay, setDataToDisplay] = useState([]);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const apiUrl = process.env.REACT_APP_API_URL;
  const columns = ['admin', 'machineName', 'optionDescription', 'target', 'dateHistory'];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios
      .get(`${apiUrl}/historyList`)
      .then((response) => {
        setDataToDisplay(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleRowClick = (rowData) => {
    setSelectedRowData(rowData);
  };

  return (
    <div className="historyAll-container">
      <div className="history-container">
        <table className="history-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column}>{column}</th>
              ))}
              <th></th>
            </tr>
          </thead>
          <tbody>
            {dataToDisplay.map((rowData) => (
              <tr className="hovered-td" key={rowData.idHistory}>
                {columns.map((column) => (
                  <td
                    key={column}
                    onClick={() => handleRowClick(rowData)}
                  >
                    {rowData[column]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="history-detail">
        <HistoryDetails rowData={selectedRowData} />
      </div>
    </div>
  );
}
