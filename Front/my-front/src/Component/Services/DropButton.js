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

const DropdownButton = ({
  statusConnection,
  idMachine,
  poweroff,
  selectedData,
  onSuccessfulDisconnect,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const history = useHistory();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const apiUrl = process.env.REACT_APP_API_URL;
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Open menu
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Close menu
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Poweroff call
  const poweroffCall = () => {
    poweroff();
    setAnchorEl(null);
  };

  // Disconnect selected machines
  const handleDisconnect = () => {
    const disconnectPromises = selectedData.map((machine) =>
      axios
        .post(`${apiUrl}/disconnect/${machine.idUser}`)
        .then(() => machine)
        .catch(() => null)
    );

    Promise.all(disconnectPromises)
      .then((disconnectedMachines) => {
        const successfulMachines = disconnectedMachines.filter(
          (machine) => machine !== null
        );
        if (onSuccessfulDisconnect) {
          onSuccessfulDisconnect(successfulMachines);
        }
      })
      .catch((error) => {
        console.error('Error disconnecting machines:', error);
      });

    setAnchorEl(null);
  };

  // File selection for upload
  const handleFileSelect = (e) => {
    setSelectedFiles((prev) => [...prev, ...e.target.files]);
  };

  // Upload single file to a machine
  const uploadFile = async (file, idUser) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post(`${apiUrl}/transfer-script/${idUser}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    } catch (error) {
      console.error('Error uploading file to machine', error);
    }
  };

  // Upload all selected files to selected machines
  const uploadFiles = async () => {
    try {
      for (const machine of selectedData) {
        const promises = selectedFiles.map((file) => uploadFile(file, machine.idUser));
        await Promise.all(promises);
      }
      setSelectedFiles([]);
      setIsPopupOpen(false);
    } catch (error) {
      console.error('Error uploading files:', error);
    }
  };

  // Remove selected file
  const removeFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Toggle upload popup
  const togglePopup = () => {
    setIsPopupOpen((prev) => !prev);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Menu Icon */}
      {(idMachine || statusConnection) && (
        <IconButton
          aria-controls="dropdown-menu"
          aria-haspopup="true"
          onClick={handleClick}
        >
          <MenuIcon fontSize="large" style={{ color: 'white' }} />
        </IconButton>
      )}

      {/* Dropdown Menu */}
      <Menu
        id="dropdown-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose} // no arguments here
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        PaperProps={{ style: { width: '300px' } }}
      >
        {statusConnection && (
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <SystemUpdateAltIcon />
            </ListItemIcon>
            Update
          </MenuItem>
        )}
        {statusConnection && (
          <MenuItem onClick={togglePopup}>
            <ListItemIcon>
              <CloudUploadIcon />
            </ListItemIcon>
            Upload
          </MenuItem>
        )}
        {statusConnection && idMachine && <hr />}
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
        {statusConnection && <hr />}
        {statusConnection && (
          <MenuItem onClick={handleDisconnect}>
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            Disconnect
          </MenuItem>
        )}
        {statusConnection && (
          <MenuItem onClick={poweroffCall}>
            <ListItemIcon>
              <PowerSettingsNewIcon />
            </ListItemIcon>
            Poweroff
          </MenuItem>
        )}
      </Menu>

      {/* Upload Popup */}
      {isPopupOpen && (
        <div className="popup-container">
          <div className="popup">
            <div className="popup-content">
              <ClearIcon
                onClick={togglePopup}
                className="close-icon"
                style={{ cursor: 'pointer' }}
              />
              <div className="custom-file">
                <input
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  id="fileInput"
                  className="custom-file-input"
                />
                <label htmlFor="fileInput" className="custom-file-label">
                  Click here to choose files to upload
                </label>
              </div>
              <hr />
              {selectedFiles.length > 0 && (
                <div className="selected-files-container">
                  {selectedFiles.map((file, index) => (
                    <div className="file-box" key={index}>
                      <div className="clear-button-container">
                        <ClearIcon
                          onClick={() => removeFile(index)}
                          fontSize="small"
                          className="clear-icon"
                          style={{ cursor: 'pointer' }}
                        />
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
              <hr />
              <div className="send-button">
                <button onClick={uploadFiles}>Upload</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownButton;