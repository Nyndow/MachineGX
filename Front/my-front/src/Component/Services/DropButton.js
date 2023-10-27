import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuIcon from '@mui/icons-material/Menu';
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import ListItemIcon from '@mui/material/ListItemIcon';
import { useHistory } from 'react-router-dom/cjs/react-router-dom';
import axios from 'axios';
import ClearIcon from '@mui/icons-material/Clear';


const DropdownButton = ({ statusConnection, idMachine, selectedData,onSuccessfulDisconnect }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const history = useHistory();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const apiUrl = process.env.REACT_APP_API_URL;
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const poweroff = () => {
    for(let i=0; i<selectedData.length; i++){
    const machine = selectedData[i];
    axios
    .post(`${apiUrl}/poweroff/${machine.idUser}`)
    .then(() => {
      setAnchorEl(null);
    })
    .catch(()=>{
    })
  }
}

/*DECONNECTION*/
const handleDisconnect = () => {
  try {
    const disconnectPromises = selectedData.map((machine) => {
      return axios.post(`${apiUrl}/disconnect/${machine.idUser}`)
        .then(() => machine) 
        .catch(() => {
          return null; 
        });
    });
    Promise.all(disconnectPromises)
    .then((disconnectedMachines) => {
      const successfulMachines = disconnectedMachines.filter(machine => machine !== null);
      if (onSuccessfulDisconnect) {
        onSuccessfulDisconnect(successfulMachines);
      }
    })
      .catch((error) => {
        console.error('Error disconnecting connected machines:', error);
      });

      setAnchorEl(null);
  } catch (error) {
    console.error('Error disconnecting connected machines:', error);
  }
};


/*UPLOAD*/
    const handleFileSelect = (e) => {
      setSelectedFiles((prevSelectedFiles) => [...prevSelectedFiles, ...e.target.files]);
    };

    const uploadFile = async (file, idUser) => {
      const formData = new FormData();
      formData.append('file', file);

      try {
        await axios.post(`${apiUrl}/transfer-script/${idUser}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } catch (error) {
        console.error(`Error uploading file to machine`, error);
      }
    };

    const uploadFiles = async () => {
      try {
        console.log('data',selectedData)
        for (const machine of selectedData) {
          const promises = selectedFiles.map((file) => uploadFile(file, machine.idUser));
          await Promise.all(promises);
        }
        setSelectedFiles([]);
      } catch (error) {
        console.error('Error uploading files:', error);
      }
    };

    const removeFile = (index) => {
      const updatedSelectedFiles = [...selectedFiles];
      updatedSelectedFiles.splice(index, 1);
      setSelectedFiles(updatedSelectedFiles);
    };

    const togglePopup = () => {
      setIsPopupOpen(!isPopupOpen);
    };

  /*END UPLOAD*/

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div>
      {
        idMachine || statusConnection ? (
          <IconButton
            aria-controls="dropdown-menu"
            aria-haspopup="true"
            onClick={handleClick}
          >
            <MenuIcon fontSize="large" style={{ color: 'white' }} />
          </IconButton>
        ) : null
      }
      </div>
      <div>
      <Menu id="dropdown-menu" anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => handleClose(null)} transformOrigin={{ vertical: 'top', horizontal: 'center' }} PaperProps={{ style: { width: '300px' } }}>
        {statusConnection && (
          <MenuItem onClick={() => handleClose('Option 1')}>
            <ListItemIcon>
              <SystemUpdateAltIcon />
            </ListItemIcon>
            Update
          </MenuItem>
        )}
        {statusConnection && (
          <MenuItem onClick={togglePopup} >
            <ListItemIcon>
              <CloudUploadIcon />
            </ListItemIcon>
            Upload
          </MenuItem>
        )}
        {statusConnection&&idMachine&&(
          <hr></hr>
        )}
        {idMachine && (
          <MenuItem onClick={() => history.push(`/editMachine/${idMachine}`)}>
            <ListItemIcon>
              <SettingsIcon /> 
            </ListItemIcon>
            Edit
          </MenuItem>
        )}
        {idMachine && (
          <MenuItem onClick={() => history.push(`/users_machine/${idMachine}`)}>
            <ListItemIcon>
              <PersonIcon /> 
            </ListItemIcon>
            Users
          </MenuItem>
        )}
        {statusConnection&&(
          <hr></hr>
        )}
        {statusConnection && (
          <MenuItem onClick={handleDisconnect}>
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            Disconnect
          </MenuItem>
        )}
        {statusConnection && (
          <MenuItem onClick={() => poweroff}>
            <ListItemIcon>
              <PowerSettingsNewIcon />
            </ListItemIcon>
            Poweroff
          </MenuItem>
        )}
      </Menu>

      </div>
            {/* Upload Section */}
            <div className="popup-container">
        {isPopupOpen && (
          <div className="popup">
            <div className="popup-content">
            <ClearIcon onClick={() => togglePopup()} className='close-icon'/>
              <div className="custom-file">
                <input type="file" multiple onChange={handleFileSelect} id="fileInput" className="custom-file-input" />
                <label htmlFor="fileInput" className="custom-file-label">Click here to choose files to upload</label>
              </div>
              <hr></hr>
              {selectedFiles.length > 0 && (
                <div className="selected-files-container">
                  {selectedFiles.map((file, index) => (
                    <div className="file-box" key={index}>
                          <div className="clear-button-container">
                            <ClearIcon onClick={() => removeFile(index)} fontSize="small" className="clear-icon" />
                          </div>
                      {file.type.startsWith('image') ? (
                        <img src={URL.createObjectURL(file)} alt={file.name} />
                      ) : file.type.startsWith('video') ? (
                        <video controls>
                          <source src={URL.createObjectURL(file)} type={file.type} />
                        </video>
                      ) : (
                        <p>{file.name}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
              <hr></hr>
              <div className="send-button">
                <button onClick={uploadFiles}>Upload</button>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Ending upload Section */}
    </div>
  );
};

export default DropdownButton;
