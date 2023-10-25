import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit'; // Make sure the import path is correct
import { useHistory } from 'react-router-dom'; // Correct the import path

export default function User() {
  const [dataToDisplay, setDataToDisplay] = useState([]);
  const { idMachine } = useParams();
  const apiUrl = process.env.REACT_APP_API_URL;
  const history = useHistory();

  useEffect(() => {
    axios.get(`${apiUrl}/machine_userList/${idMachine}`)
      .then(response => {
        setDataToDisplay(response.data);
      })
      .catch(error => {
        console.error('Error fetching data: ', error);
      });
  }, [idMachine]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ height: '700px', overflow: 'auto' }} className="process-container">
        <table className="process-table">
          <thead>
            <tr>
              <th>N°EMP</th>
              <th>Username</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {dataToDisplay.map(user => (
              <tr key={user.idUser} className="process-table-row-even">
                <td>{user.numEmployee}</td>
                <td>{user.userUsername}</td>
                <td>
                  <button
                    className="stop-button"
                    onClick={() => history.push(`/user_edit/${user.idUser}`)}
                    style={{ padding: '5px 10px' }}
                  >
                    <EditIcon />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
