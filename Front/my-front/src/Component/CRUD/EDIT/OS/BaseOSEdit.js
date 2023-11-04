import React, { useState, useCallback, useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useHistory } from 'react-router-dom';

export default function BaseOSEdit() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { idBaseOsys } = useParams();
  const [userFormData, setUserFormData] = useState({
    nameBase: '',
    imgOs: '',
  });
  const history = useHistory()

  useEffect(() => {

    axios
    .get(`${apiUrl}/baseOsys/${idBaseOsys}`)
    .then((response) => {
        setUserFormData(response.data);
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
        .put(`${apiUrl}/baseOsys/${idBaseOsys}`, dataToSend)
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
        <h3>User Information</h3>
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
            Update
          </Button>
        </div>
      </div>
    </div>
  );
}
