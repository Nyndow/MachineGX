import React, { useState, useCallback, useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

export default function BaseOsAdd() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userFormData, setUserFormData] = useState({
    nameBase:'',
    imgOs:'',
  });
  const history = useHistory()

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

  console.log(userFormData)
  

  const handleSubmit = useCallback(() => {
    if (!isSubmitting) {
      setIsSubmitting(true);

      axios.post(`${apiUrl}/baseOsys/`, userFormData, {
        headers: { 'Content-Type': 'application/json' },
      })      
        .then(() => {
            history.push('/base_osys')
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
    <div className="machineOption-container" style={{width:'30%'}}>
      <div className="input-group">
        <h3>Base System Information</h3>
        <TextField
          id="numEmp-basic"
          label="Operating System"
          variant="standard"
          name="nameBase"
          value={userFormData.nameBase}
          onChange={handleUserInputChange}
          style={{ marginBottom: '10px' }}
          required
        />

        <input
        type="file"
        name="imgOs"
        onChange={handleFileInputChange}
        style={{ marginBottom: '10px' }}
        accept="image/jpeg, image/png"
        multiple={false}
        />

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="text"
            onClick={handleSubmit}
            disabled={Object.values(userFormData).some((value) => value === '')}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
