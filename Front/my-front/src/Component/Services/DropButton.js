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


const DropdownButton = ({ statusConnection, idMachine }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const history = useHistory();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const goEdit= () =>{
    history.push
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div>
        <IconButton
          aria-controls="dropdown-menu"
          aria-haspopup="true"
          onClick={handleClick}
        >
          <MenuIcon fontSize="large" style={{ color: 'white' }} />
        </IconButton>
      </div>
      <div>
        <Menu
          id="dropdown-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => handleClose(null)}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          PaperProps={{
            style: {
              width: '300px',
            },
          }}
        >
          {statusConnection && (
            <MenuItem onClick={() => handleClose('Option 1')}>
              <ListItemIcon>
                <SystemUpdateAltIcon />
              </ListItemIcon>
              Update
            </MenuItem>
          )}
          {statusConnection && (
            <MenuItem onClick={() => handleClose('Option 2')}>
              <ListItemIcon>
                <CloudUploadIcon />
              </ListItemIcon>
              Upload
            </MenuItem>
          )}
          {statusConnection&&(
            <hr></hr>
          )}
          <MenuItem onClick={() => history.push(`/editMachine/${idMachine}`)}>
            <ListItemIcon>
              <SettingsIcon /> 
            </ListItemIcon>
            Edit
          </MenuItem>
          <MenuItem onClick={() => history.push(`/users_machine/${idMachine}`)}>
            <ListItemIcon>
              <PersonIcon /> 
            </ListItemIcon>
            Users
          </MenuItem>
          {statusConnection&&(
            <hr></hr>
          )}
          {statusConnection && (
            <MenuItem onClick={() => handleClose('Option 3')}>
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              Disconnect
            </MenuItem>
          )}
          {statusConnection && (
            <MenuItem onClick={() => handleClose('Option 6')}>
              <ListItemIcon>
                <PowerSettingsNewIcon />
              </ListItemIcon>
              Poweroff
            </MenuItem>
          )}
        </Menu>
      </div>
    </div>
  );
};

export default DropdownButton;
