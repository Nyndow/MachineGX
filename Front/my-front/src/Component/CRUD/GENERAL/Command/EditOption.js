import React, { useState, useEffect, useCallback } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import ClearIcon from '@mui/icons-material/Clear';
import axios from 'axios';
import Checkbox from '@mui/material/Checkbox';

function EditOption({apiUrl, closeAddDialog, rowOption }) {
  const [formData, setFormData] = useState({
    idOption:'',
    optionSyntax: '',  
    optionDescription: '',
    optionComment: '',
    targetIn: false
  });


  console.log(formData)

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

  useEffect(() => {
    if (rowOption) {
      setFormData({
        ...rowOption,
        idOption: rowOption.idOption || '',
        optionSyntax: rowOption.optionSyntax || '',
        optionDescription: rowOption.optionDescription || '',
        optionComment: rowOption.optionComment || '',
        targetIn: rowOption.targetIn || false
      });
    }
  }, [rowOption]);
  const handleUpdateCommand = () => {
    axios
      .put(`${apiUrl}/option/${rowOption.idOption}`, formData)
      .then(() => {
        closeAddDialog();
      })
      .then(() => {
      })
      .catch((error) => {
        console.error('Error updating command:', error);
      });
  };
  

  return (
    <div className="popup">
      <div className="popup-content" style={{ width: '20%', display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#110f18' }}>
        <ClearIcon onClick={closeAddDialog} className='close-icon' />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          <TextField
            id="numEmp-basic"
            label="Command"
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
            id="userUsername-basic"
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
            id="sfssfs-basic"
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
            <label>
            <Checkbox
              checked={formData.targetIn}
              onChange={handleUserInputChange}
              name="targetIn"
            />
            Target
          </label>
        </div>
        <Button style={{ display: 'flex', justifyContent: 'flex-end' }} variant='outlined' onClick={handleUpdateCommand}>Update</Button>
      </div>
    </div>
  );
}

export default EditOption;
