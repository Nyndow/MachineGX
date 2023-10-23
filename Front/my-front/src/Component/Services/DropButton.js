import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuIcon from '@mui/icons-material/Menu';

const DropdownButton = ({ statusConnection }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (option) => {
    setAnchorEl(null);
    if (option) {
      setSelectedOption(option);
    }
  };

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
          {!statusConnection && (
          <div>
          <MenuItem onClick={() => handleClose('Option 0')}>Connect</MenuItem>
          <hr></hr>
          </div>
          )}
          <MenuItem onClick={() => handleClose('Option 1')}>Update</MenuItem>
          <MenuItem onClick={() => handleClose('Option 2')}>Upload</MenuItem>
          {statusConnection && (
            <MenuItem onClick={() => handleClose('Option 3')}>Disconnect</MenuItem>
          )}
          <MenuItem onClick={() => handleClose('Option 5')}>Edit</MenuItem>
          {statusConnection && (
            <MenuItem onClick={() => handleClose('Option 6')}>Poweroff</MenuItem>
          )}
        </Menu>
      </div>
    </div>
  );
};

export default DropdownButton;
