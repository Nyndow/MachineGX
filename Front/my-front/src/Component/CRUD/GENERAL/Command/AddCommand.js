import React from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import ClearIcon from '@mui/icons-material/Clear';

function AddCommand({baseOSList, handleNewCommandChange, handleUserInputChange, closeAddDialog, formData }) {
  return (
    <div className="popup">
      <div className="popup-content" style={{ width: '20%', display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#110f18' }}>
        <ClearIcon onClick={closeAddDialog} className='close-icon' /> 
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          <TextField
            id="command-add-basic"
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
            id="command-desc-basic"
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
            id="command-comment-basic"
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
        </div>
        <FormControl component="fieldset" style={{ minWidth: '85%' }}>
          <FormLabel id="form-os-command" style={{ display: 'flex' }}>
            Select Base OS
          </FormLabel>
          <RadioGroup
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="idBaseOsys"
            value={formData.idBaseOsys}
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
        <Button style={{ display: 'flex', justifyContent: 'flex-end' }} variant='outlined' onClick={handleNewCommandChange}>Save</Button>
      </div>
    </div>
  );
}

export default AddCommand;
