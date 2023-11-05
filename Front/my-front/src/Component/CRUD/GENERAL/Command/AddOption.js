import React from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import ClearIcon from '@mui/icons-material/Clear';
import Checkbox from '@mui/material/Checkbox'; 
import { useState, useCallback } from 'react';
import axios from 'axios';

function AddOption({closeAddDialog, idCommand}) {

  const initialValue = {
    commandName: '',
    commandDescription: '',
    commandComment: '',
    idBaseOsys: '',
    targetIn : false
  };
  const apiUrl = process.env.REACT_APP_API_URL;
  const [formData, setFormData] = useState(initialValue);

  const handleUserInputChange = useCallback((event) => {
    const { name, value, type, checked } = event.target;
  
    if (type === 'checkbox') {
      setFormData((prevData) => ({
        ...prevData,
        [name]: checked,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  }, []);

  const handleNewCommandChange = useCallback(() => {
    const dataToSend = {
      ...formData,
      idCommand: idCommand
    };
    axios
      .post(`${apiUrl}/option/`, dataToSend)
      .then((response) => {
        setFormData(initialValue);
        closeAddDialog();
      })
      .catch((error) => {
        console.error('Error sending data:', error);
      });
  }, [formData, idCommand]);
  

  return (
    <div className="popup">
      <div className="popup-content" style={{ width: '20%', display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#110f18' }}>
        <ClearIcon onClick={closeAddDialog} className='close-icon' /> 
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          <TextField
            id="optioon-basic"
            label="Option"
            variant="standard"
            name="optionSyntax"
            value={formData.optionSyntax}
            onChange={handleUserInputChange}
            style={{ marginBottom: '10px', minWidth: '85%' }}
            required
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          <TextField
            id="description-basic"
            label="Description"
            variant="standard"
            name="optionDescription"
            value={formData.optionDescription}
            onChange={handleUserInputChange}
            style={{ marginBottom: '10px', minWidth: '85%' }}
            required
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          <TextField
            id="CommentOption-basic"
            label="Comment"
            variant="standard"
            name="optionComment"
            multiline
            rows={4}
            value={formData.optionComment}
            onChange={handleUserInputChange}
            style={{ marginBottom: '10px', minWidth: '85%' }}
            required
          />
        </div>
        <label>
            <Checkbox
              checked={formData.targetIn}
              onChange={handleUserInputChange}
              name="targetIn"
            />
            Target
          </label>
        <Button style={{ display: 'flex', justifyContent: 'flex-end' }} variant='outlined' onClick={handleNewCommandChange}>Save</Button>
      </div>
    </div>
  );
}

export default AddOption;
