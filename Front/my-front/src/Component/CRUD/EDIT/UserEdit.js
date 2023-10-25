import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import '../../../Styles/machineOption.css';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useParams } from 'react-router-dom';

function UserEdit() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const { idUser } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const initialFormData = {
    numEmployee: '',
    userUsername: '',
    userPassword: '', 
  };
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    axios.get(`${apiUrl}/user/${idUser}`)
      .then((response) => {
        const formattedData = { ...response.data };
        setFormData(formattedData);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, [idUser]);

  const handleInputChange = useCallback((event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }, []);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = useCallback(() => {
    if (!isSubmitting) {
      setIsSubmitting(true);

      axios
        .put(`${apiUrl}/user/${idUser}`, { ...formData })
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.error('Error sending data:', error);
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    }
  }, [apiUrl, isSubmitting, formData, idUser]);

  const isFormEmpty = Object.values(formData).some((value) => value === '');

  return (
    <div className="machineOption-container">
      <div className="input-group">
        <h3>User Information</h3>
        <TextField
          id="numEMP-basic"
          label="N°Employee"
          variant="standard"
          name="numEmployee"
          value={formData.numEmployee}
          onChange={handleInputChange}
          style={{ marginBottom: '10px' }}
          required
        />
        <TextField
          id="userUsername-basic"
          label="Username"
          variant="standard"
          name="userUsername"
          value={formData.userUsername}
          onChange={handleInputChange}
          style={{ marginBottom: '10px' }}
          required
        />
        <InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
        <Input
          id="standard-adornment-password"
          type={showPassword ? 'text' : 'password'}
          value={formData.userPassword}
          onChange={handleInputChange}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={toggleShowPassword}
              >
                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </IconButton>
            </InputAdornment>
          }
        />

        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '15px', paddingBottom: '15px' }}>
          <Button
            color="primary"
            variant="text"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onClick={handleSubmit}
            disabled={isFormEmpty}
          >
            Update
          </Button>
        </div>
      </div>
    </div>
  );
}

export default UserEdit;
