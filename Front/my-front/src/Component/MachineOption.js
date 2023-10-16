import React, { useEffect, useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import '../Styles/machineOption.css';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import HelpIcon from '@mui/icons-material/Help';

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
  const [userFormData, setUserFormData] = useState({
    numEMP: '',
    userUsername: '',
    userPassword: '',
  });
  const [linkMachine, setLinkMachine] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  console.log(formData,userFormData)

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

      axios
        .post(`${apiUrl}/machine_user_add/`, { ...formData, ...userFormData })
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
  }, [apiUrl, isSubmitting, formData, userFormData]);

  const handleNext = () => {
    if (currentStep < 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isFormEmpty = currentStep === 0
    ? Object.values(formData).some((value) => value === '')
    : Object.values(userFormData).some((value) => value === '');

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
        {currentStep === 0 && (
          <>
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
                Save without adding user
              </Button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end'}}>
              <Button
                variant="contained"
                color="success"
                onClick={handleNext}
                disabled={isFormEmpty} 
              >
                Next
              </Button>
            </div>
          </>
        )}

        {currentStep === 1 && (
          <>
            <h3>User Information</h3>
            <TextField
              id="numEmp-basic"
              label="N° EMP"
              variant="standard"
              name="numEMP"
              value={userFormData.numEMP}
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
                onClick={handlePrevious}
              >
                Previous
              </Button>
              <Button
                variant="contained"
                color="success"
                onClick={handleSubmit}
                disabled={Object.values(userFormData).some((value) => value === '')}
              >
                Submit
              </Button>
            </div>
          </>
        )}
      </div>
      {linkMachine !== '' && <p style={{color:'green'}}>Machine created successfully, click <Link
              color="info"
              href={`/machine-page/${linkMachine.link}`}
              underline="hover"
            >here </Link> to configure </p>}
    </div>
  );
}

export default MachineOption;
