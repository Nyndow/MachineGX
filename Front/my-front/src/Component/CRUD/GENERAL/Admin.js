import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit'; 
import AddIcon from '@mui/icons-material/Add'; 
import { useHistory } from 'react-router-dom';
import Button from '@mui/material/Button'; 

export default function Admin() {
  const [dataToDisplay, setDataToDisplay] = useState([]);
  const apiUrl = process.env.REACT_APP_API_URL;
  const history = useHistory();

  useEffect(() => {
    axios.get(`${apiUrl}/administration/`)
      .then(response => {
        setDataToDisplay(response.data);
      })
      .catch(error => {
        console.error('Error fetching data: ', error);
      });
  }, []);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ height: '700px', overflow: 'auto' }} className="process-container">
        <table className="process-table">
          <thead>
            <tr>
              <th>N°EMP</th>
              <th>Username</th>
              <th>Is Admin</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {dataToDisplay.map(admin => (
              <tr key={admin.idAdmin} className="process-table-row-even">
                <td>{admin.numEmployee}</td>
                <td>{admin.adminUsername}</td>
                <td>
                {admin.isAdmin ? (
                    <span style={{ color: 'green' }}>&#10004;</span>
                ) : (
                    <span style={{ color: 'gray',fontSize: '0.7em' }}>&#10060;</span>
                )}
                </td>
                <td>
                  <button
                    className="stop-button"
                    onClick={() => history.push(`/admin_edit/${admin.idAdmin}`)}
                    style={{ padding: '5px 10px' }}
                  >
                    <EditIcon />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <Button variant="text" startIcon={<AddIcon />} onClick={() => history.push(`/admin_add/`)}>
            Add new admin
          </Button>
        </div>
      </div>
    </div>
  );
}
