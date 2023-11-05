import React, { useState, useEffect, useCallback } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import ClearIcon from '@mui/icons-material/Clear';
import axios from 'axios';
import Checkbox from '@mui/material/Checkbox';

function EditOption({apiUrl, closeAddDialog,refreshData, idCommand }) {
  const [formData, setFormData] = useState({
    optionSyntax: '',  
    optionDescription: '',
    optionComment: '',
    targetIn: false,
  });

  const handleUserInputChange = useCallback((event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }, []);

useEffect(() => {
axios.get(`${apiUrl}/command/${idCommand}`)
.then((response)=>{
  setFormData(response.data)
})
  },[idCommand]);

  const handleUpdateCommand = () => {
    axios
      .put(`${apiUrl}/command/${idCommand}`, formData)
      .then(() => {
        closeAddDialog();
      })
      .then(() => {
        refreshData();
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
            name="commandName"
            value={formData.commandName}
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
            name="commandDescription"
            value={formData.commandDescription}
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
            name="commandComment"
            multiline
            rows={4}
            value={formData.commandComment}
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
