import React, { useEffect, useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import '../Styles/machineOption.css';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

function MachineOption() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [oSysData, setOsData] = useState([]);
  const [formData, setFormData] = useState({
    ipAddr: '',
    portNumber: '',
    machineName: '',
    nomOS: '',
    versionOS: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = useCallback(() => {
    axios
      .get(`${apiUrl}/oSys`)
      .then((response) => {
        setOsData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, [apiUrl]);

  const handleInputChange = useCallback((event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }, []);

  const handleSubmit = useCallback(() => {
    if (!isSubmitting) {
      setIsSubmitting(true);

      axios
        .post(`${apiUrl}/machine_user_add/`, formData)
        .then((response) => {
          console.log('Data sent successfully', response);
        })
        .catch((error) => {
          console.error('Error sending data:', error);
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    }
  }, [apiUrl, isSubmitting, formData]);

  const nomOSOptions = useMemo(() => {
    // Create an array of unique nomOS values
    const uniqueNomOS = [...new Set(oSysData.map((item) => item.nomOS))];

    return uniqueNomOS.map((nomOSValue, index) => (
      <MenuItem key={index} value={nomOSValue}>
        {nomOSValue}
      </MenuItem>
    ));
  }, [oSysData]);

  const versionOSOptions = useMemo(() => {
    return oSysData
      .filter((item) => item.nomOS === formData.nomOS)
      .map((item) => (
        <MenuItem key={item.idOsys} value={item.versionOS}>
          {item.versionOS}
        </MenuItem>
      ));
  }, [oSysData, formData.nomOS]);

  return (
    <div className="machineOption-container">
      <div className="input-group">
        <div>
          <label htmlFor="machineNameInput">Machine Name:</label>
          <input
            type="text"
            id="machineNameInput"
            name="machineName"
            value={formData.machineName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="ipAddrInput">IP Address:</label>
          <input
            type="text"
            id="ipAddrInput"
            name="ipAddr"
            value={formData.ipAddr}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="portNumberInput">Port Number:</label>
          <input
            type="text"
            id="portNumberInput"
            name="portNumber"
            value={formData.portNumber}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>

      <div className='select-OS'> 
        <Box sx={{ minWidth: 120 }}>
        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="nomOSSelect-label">OS</InputLabel>
            <Select
              labelId="nomOSSelect-label"
              id="nomOSSelect"
              name="nomOS"
              value={formData.nomOS}
              onChange={handleInputChange}
            >
              {nomOSOptions}
            </Select>
          </FormControl>
          </Box>
          <Box sx={{ minWidth: 120 }}>
          <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="demo-simple-select-label">Version</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="versionOSSelect"
              name="versionOS"
              value={formData.versionOS}
              onChange={handleInputChange}
            >
              {versionOSOptions}
            </Select>
          </FormControl>
        </Box>
      </div>

      <button onClick={handleSubmit} disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit Data'}
      </button>
    </div>
  );
}

export default MachineOption;
