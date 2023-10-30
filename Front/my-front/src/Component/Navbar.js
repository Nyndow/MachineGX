import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import "../Styles/Sidebar.css";
import TerminalIcon from "../Utils/icons/settings.png";
import Logout from "../Utils/icons/exit.png";
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import IconButton from '@mui/material/IconButton';
import HomeIcon from '@mui/icons-material/Home';
import HistoryIcon from '@mui/icons-material/History';
import DevicesIcon from '@mui/icons-material/Devices';
function Sidebar() {
  const history = useHistory();
  const [authenticated, setAuthenticated] = useState(true);
  const [selectedOption, setSelectedOption] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('token');
    setAuthenticated(false);
    history.push('/login');
  };

  const handleOptionChange = (event) => {
    const newSelectedOption = event.target.value;
    setSelectedOption(newSelectedOption);

    if (newSelectedOption) {
      history.push(`/${newSelectedOption}`);
    }
  };

  return (
    authenticated ? (
      <div className="sidebar">
          <IconButton>
            <HomeIcon fontSize='large' onClick={() => history.push('/home')} />
          </IconButton>
          <IconButton>
            <DevicesIcon fontSize='large' onClick={() => history.push('/machine-all')} />
          </IconButton>
        <IconButton>
            <HistoryIcon fontSize='large' onClick={() => history.push('/history')} />
          </IconButton>
        {localStorage.getItem('isAdmin') && (
          <IconButton>
            <SupervisorAccountIcon fontSize='large' onClick={() => history.push('/administration')} />
          </IconButton>
        )}
        <div className="select-dropdown">
          <select value={selectedOption} onChange={handleOptionChange}>
            <option value="">CRUD</option>
            <option value="crud-command">Command</option>
            <option value="crud-option">Option</option>
            <option value="crud-os">OS</option>
            <option value="crud-attribution">Attribution</option>
          </select>
        </div>
        <button className="logout-button" onClick={handleLogout}>
          <img src={Logout} alt="machine" />
        </button>
      </div>
    ) : null
  );
}

export default Sidebar;
