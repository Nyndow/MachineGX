import React, { useState, useCallback, useEffect } from 'react';
import Button from '@mui/material/Button';
import axios from 'axios';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

export default function AttributionAdd() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userFormData, setUserFormData] = useState({
    idUser: '',
    dateDebut: '',
    dateFin: ''
  });
  const [machineList, setMachineList] = useState([]);

  useEffect(() => {
    axios
      .get(`${apiUrl}/user/`)
      .then((response) => {
        setMachineList(response.data);
      })
      .catch(() => {
        console.log('Error fetching machines');
      });
  }, []);

  const handleSelectChange = (event) => {
    const value = event.target.value;
    setUserFormData((prevData) => ({
      ...prevData,
      idUser: value,
    }));
  };
  
  const handleDateChange = (name, value) => {
    setUserFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  
  

  const handleSubmit = useCallback(() => {
    if (!isSubmitting) {
      setIsSubmitting(true);

      const dataToSend = { ...userFormData };

      axios
        .post(`${apiUrl}/attribution/`, dataToSend)
        .then((response) => {
          console.log("OS added");
        })
        .catch((error) => {
          console.error('Error sending data:', error);
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    }
  }, [apiUrl, isSubmitting, userFormData]);

  return (
    <div className="machineOption-container">
      <div className="input-group">
        <h3>Attribution Information</h3>
        <FormControl style={{ minWidth: '80%' }}>
  <InputLabel>Select User</InputLabel>
  <Select
    value={userFormData.idUser}
    onChange={handleSelectChange}
  >
    {machineList.map((machine) => (
      <MenuItem key={machine.idUser} value={machine.idUser}>
        {machine.userUsername}|{machine.numEmployee}
      </MenuItem>
    ))}
  </Select>
</FormControl>

        </div>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
  <DateTimePicker
    label="Start"
    name="dateDebut"
    value={userFormData.dateDebut}
    onChange={(value) => handleDateChange("dateDebut", value)}
    required
  />
  <DateTimePicker
    label="End"
    name="dateFin"
    value={userFormData.dateFin}
    onChange={(value) => handleDateChange("dateFin", value)}
    required
  />
</LocalizationProvider>


        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="text"
            onClick={handleSubmit}
            disabled={Object.values(userFormData).some((value) => value === '')}
          >
            Submit
          </Button>
      </div>
    </div>
  );
}
