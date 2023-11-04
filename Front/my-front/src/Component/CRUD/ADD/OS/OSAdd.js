import React, { useState, useCallback, useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

export default function OSAdd() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userFormData, setUserFormData] = useState({
    nomOS: '',
    versionOS: '',
    imgOs: '',
    baseOS: '',
  });
  const [baseOSList, setBaseOSList] = useState([]);

  useEffect(() => {
    axios
      .get(`${apiUrl}/baseOsys`)
      .then((response) => {
        setBaseOSList(response.data);
      })
      .catch(() => {
        console.log('Error fetching base OS');
      });
  }, []);

  const handleUserInputChange = useCallback((event) => {
    const { name, value } = event.target;
    setUserFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }, []);

  const handleFileInputChange = useCallback((event) => {
    const { files } = event.target;
  
    if (files && files.length > 0) {
      const fileName = files[0].name;
      setUserFormData((prevData) => ({
        ...prevData,
        imgOs: fileName,
      }));
    }
  }, []);
  

  const handleSubmit = useCallback(() => {
    if (!isSubmitting) {
      setIsSubmitting(true);

      const dataToSend = { ...userFormData };

      axios
        .post(`${apiUrl}/oSys/`, dataToSend)
        .then((response) => {
            console.log("OS added")
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
        <h3>Operating System Information</h3>
        <TextField
          id="numEmp-basic"
          label="Operating System"
          variant="standard"
          name="nomOS"
          value={userFormData.nomOS}
          onChange={handleUserInputChange}
          style={{ marginBottom: '10px' }}
          required
        />
        <TextField
          id="userUsername-basic"
          label="Version"
          variant="standard"
          name="versionOS"
          value={userFormData.versionOS}
          onChange={handleUserInputChange}
          style={{ marginBottom: '10px' }}
          required
        />
<div style={{ display: 'flex', alignItems: 'center' }}>
  <input
    type="file"
    name="imgOs"
    onChange={handleFileInputChange}
    style={{
      marginBottom: '10px',
      width: '200px',
      height: '40px',
      fontSize: '16px',
    }}
    accept="image/jpeg, image/png"
    multiple={false}
  />
</div>

        <FormControl
          component="fieldset"
          style={{ display: 'flex', justifyContent: 'space-between' }}
        >
          <FormLabel id="demo-row-radio-buttons-group-label" style={{ display: 'flex' }}>
            Select Base OS
          </FormLabel>
          <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="baseOS"
            value={userFormData.baseOS}
            onChange={handleUserInputChange}
          >
            {baseOSList.map((baseOSItem) => (
              <FormControlLabel
                key={baseOSItem.idBaseOsys} 
                value={baseOSItem.idBaseOsys}
                control={<Radio />}
                label={baseOSItem.nameBase}
              />
            ))}
          </RadioGroup>
        </FormControl>

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
    </div>
  );
}
