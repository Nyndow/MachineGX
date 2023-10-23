import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuIcon from '@mui/icons-material/Menu';

const DropdownButton = () => {
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
    <div>
    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
      <IconButton
        aria-controls="dropdown-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MenuIcon fontSize="large" style={{ color: 'white' }} />
      </IconButton>
      <Menu
        id="dropdown-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleClose(null)} 
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={() => handleClose('Option 1')}>Option 1</MenuItem>
        <MenuItem onClick={() => handleClose('Option 2')}>Option 2</MenuItem>
        <MenuItem onClick={() => handleClose('Option 3')}>Option 3</MenuItem>
      </Menu>
    </div>
    <p>Option choosed: {selectedOption}</p>
    </div>
  );
};

export default DropdownButton;
