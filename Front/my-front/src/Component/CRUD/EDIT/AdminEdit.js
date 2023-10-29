import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import '../../../Styles/machineOption.css';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Input from '@mui/material/Input';
import Checkbox from '@mui/material/Checkbox';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import DeleteIcon from '@mui/icons-material/Delete';
import { useHistory, useParams } from 'react-router-dom';

function AdminEdit() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { idAdmin } = useParams();

  const initialFormData = {
    numEmployee: '',
    adminUsername: '',
    isAdmin: false,
  };
  const [adminPassword, setAdminPassword] = useState('');
  const [formData, setFormData] = useState(initialFormData);
  const history = useHistory();

  useEffect(() => {
    axios
      .get(`${apiUrl}/administration/${idAdmin}`)
      .then((response) => {
        const formattedData = { ...response.data };
        setFormData(formattedData);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, [apiUrl, idAdmin]);

  const handleInputChange = useCallback((event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }, []);

  const handlePasswordChange = (event) => {
    setAdminPassword(event.target.value);
  };

  const handleIsAdminChange = () => {
    setFormData((prevData) => ({
      ...prevData,
      isAdmin: !prevData.isAdmin,
    }));
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = useCallback(() => {
    if (!isSubmitting) {
      setIsSubmitting(true);

      const dataToSend = {
        ...formData,
        adminPassword,
      };

      if (adminPassword === '') {
        delete dataToSend.adminPassword;
      }

      axios
        .put(`${apiUrl}/administration/${idAdmin}`, dataToSend)
        .then((response) => {
          history.goBack();
        })
        .catch((error) => {
          console.error('Error sending data:', error);
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    }
  }, [apiUrl, isSubmitting, formData, idAdmin, adminPassword, history]);

  const handleDelete = () => {
    axios
      .delete(`${apiUrl}/administration/${idAdmin}`)
      .then(() => {
        history.goBack();
      })
      .catch((error) => {
        console.error('Error deleting item:', error);
      });
  };

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
          name="adminUsername"
          value={formData.adminUsername}
          onChange={handleInputChange}
          style={{ marginBottom: '10px' }}
          required
        />
        <InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
        <Input
          id="standard-adornment-password"
          type={showPassword ? 'text' : 'password'}
          value={adminPassword}
          onChange={handlePasswordChange}
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
        <label>
          <Checkbox
            checked={formData.isAdmin}
            onChange={handleIsAdminChange}
            name="isAdmin"
          />
          Is Admin
        </label>

        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            paddingTop: '15px',
            paddingBottom: '15px',
          }}
        >
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
        <button onClick={handleDelete} style={{ width: '45px' }}>
          <DeleteIcon />
        </button>
      </div>
    </div>
  );
}

export default AdminEdit;
