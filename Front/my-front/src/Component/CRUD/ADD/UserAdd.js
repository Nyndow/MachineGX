import React, { useState, useCallback } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import { useParams } from 'react-router-dom/cjs/react-router-dom';

export default function UserAdd() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userFormData, setUserFormData] = useState({
    numEmployee: '',
    userUsername: '',
    userPassword: '',
  });
  const { idMachine } = useParams();

  const handleUserInputChange = useCallback((event) => {
    const { name, value } = event.target;
    setUserFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }, []);

  const handleSubmit = useCallback(() => {
    if (!isSubmitting) {
      setIsSubmitting(true);
    
      const dataToSend = { ...userFormData, idMachine };

      axios
        .post(`${apiUrl}/user/`, dataToSend)
        .then((response) => {
        })
        .catch((error) => {
          console.error('Error sending data:', error);
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    }
  }, [apiUrl, isSubmitting, userFormData, idMachine]);

  return (
    <div className="machineOption-container">
      <div className="input-group">
        <h3>User Information</h3>
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
          name="userUsername"
          value={userFormData.userUsername}
          onChange={handleUserInputChange}
          style={{ marginBottom: '10px' }}
          required
        />
        <TextField
          id="userPassword-basic"
          label="Password"
          variant="standard"
          name="userPassword"
          value={userFormData.userPassword}
          onChange={handleUserInputChange}
          style={{ marginBottom: '10px' }}
          required
        />

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
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
