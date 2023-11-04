import React, { useState, useCallback, useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useHistory } from 'react-router-dom';

export default function OSEdit() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { idOS } = useParams();
  const [userFormData, setUserFormData] = useState({
    nomOS: '',
    versionOS: '',
    imgOs: '',
  });
  const history = useHistory()

  useEffect(() => {

    axios
    .get(`${apiUrl}/oSys/${idOS}`)
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
        .put(`${apiUrl}/oSys/${idOS}`, dataToSend)
        .then(() => {
            history.push('/osys')
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
            Upload
          </Button>
        </div>
      </div>
    </div>
  );
}
