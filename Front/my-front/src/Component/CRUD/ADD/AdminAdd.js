import React, { useState, useCallback } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox'; 
import axios from 'axios';
import { useHistory } from 'react-router-dom';

export default function AdminAdd() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); 
  const history = useHistory();
  const [userFormData, setUserFormData] = useState({
    numEmployee: '',
    adminUsername: '',
    adminPassword: '',
  });

  const handleUserInputChange = useCallback((event) => {
    const { name, value, type, checked } = event.target;

    if (type === 'checkbox') {
      setIsAdmin(checked);
    } else {
      setUserFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  }, []);

  const handleSubmit = useCallback(() => {
    if (!isSubmitting) {
      setIsSubmitting(true);

      const dataToSend = { ...userFormData, isAdmin };

      axios
        .post(`${apiUrl}/administration/`, dataToSend)
        .then((response) => {
          history.push('/administration')
        })
        .catch((error) => {
          console.error('Error sending data:', error);
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    }
  }, [apiUrl, isSubmitting, userFormData, isAdmin]);

  return (
    <div className="machineOption-container">
      <div className="input-group">
        <h3>Admin Information</h3>
        <TextField
          id="numEmp-basic"
          label="N° EMP"
          variant="standard"
          name="numEmployee"
          value={userFormData.numEmployee}
          onChange={handleUserInputChange}
          style={{ marginBottom: '10px' }}
          required
        />
        <TextField
          id="userUsername-basic"
          label="Username"
          variant="standard"
          name="adminUsername"
          value={userFormData.adminUsername}
          onChange={handleUserInputChange}
          style={{ marginBottom: '10px' }}
          required
        />
        <TextField
          id="userPassword-basic"
          label="Password"
          variant="standard"
          name="adminPassword"
          value={userFormData.adminPassword}
          onChange={handleUserInputChange}
          style={{ marginBottom: '10px' }}
          required
        />
          <label>
            <Checkbox
              checked={isAdmin}
              onChange={handleUserInputChange}
              name="isAdmin"
            />
            Is Admin
          </label>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            color="success"
            onClick={handleSubmit}
            disabled={Object.values(userFormData).some((value) => value === '')}
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
}
