import React, { useEffect, useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import '../../../Styles/machineOption.css';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import HelpIcon from '@mui/icons-material/Help';
import { useParams } from 'react-router-dom';

function MachineEdit() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const { idMachine } = useParams();
  const [oSysData, setOsData] = useState([]);
  const [linkMachine, setLinkMachine] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    machineName: '', 
    ipAddr: '', 
    portNumber: '', 
    nomOS: '', 
    versionOS: '', 
  });

  useEffect(() => {
    fetchData();
  }, []);
  
  useEffect(() => {
    axios.get(`${apiUrl}/machine/${idMachine}`)
      .then((response) => {
        const formattedData = { ...response.data };
        setFormData(formattedData);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, [idMachine]);
  

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
        .put(`${apiUrl}/machine/${idMachine}`, { ...formData })
        .then((response) => {
          setLinkMachine(response.data)
          console.log(response.data)
        })
        .catch((error) => {
          console.error('Error sending data:', error);
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    }
  }, [apiUrl, isSubmitting, formData]);
  console.log(localStorage)

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

  const isFormEmpty = Object.values(formData).some((value) => value === '');

  return (
    <div className="machineOption-container">
      <div className="input-group">
            <h3>Machine Information </h3>
            <TextField
              id="numEMP-basic"
              label="Machine Name"
              variant="standard"
              name="machineName"
              value={formData.machineName}
              onChange={handleInputChange}
              style={{ marginBottom: '10px' }}
              required
            />
            <TextField
              id="userUsername-basic"
              label="IP Address"
              variant="standard"
              name="ipAddr"
              value={formData.ipAddr}
              onChange={handleInputChange}
              style={{ marginBottom: '10px' }}
              required
            />
            <TextField
              id="userPassword-basic"
              label="Port Number"
              variant="standard"
              name="portNumber"
              value={formData.portNumber}
              onChange={handleInputChange}
              style={{ marginBottom: '10px' }}
              required
            />

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
                    required
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
                    required
                  >
                    {versionOSOptions}
                  </Select>
                </FormControl>
              </Box>
            </div>

            <Link
              fontSize="small"
              color="info"
              href="/add/oSys"
              underline="hover"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
              }}
            >
              <HelpIcon style={{ marginRight: '4px' }} />OS not there?
            </Link>

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
      {linkMachine !== '' && <p style={{color:'green'}}>Machine updated successfully, click <Link
              color="info"
              href={`/machine-page/${linkMachine.link}`}
              underline="hover"
            >here </Link> to configure </p>}
    </div>
  );
}

export default MachineEdit;
