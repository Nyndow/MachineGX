import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import "../Styles/Sidebar.css";
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import HomeIcon from '@mui/icons-material/Home';
import HistoryIcon from '@mui/icons-material/History';
import DevicesIcon from '@mui/icons-material/Devices';
import LogoutIcon from '@mui/icons-material/Logout';
import TerminalIcon from '@mui/icons-material/Terminal';
import AttributionIcon from '@mui/icons-material/Attribution';
import SettingsSystemDaydreamIcon from '@mui/icons-material/SettingsSystemDaydream';

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
        <button onClick={() => history.push('/home')}>
          <HomeIcon fontSize='large' />
        </button>
        <button onClick={() => history.push('/machine-all')}>
          <DevicesIcon fontSize='large' />
        </button>
        <button onClick={() => history.push('/history')}>
          <HistoryIcon fontSize='large' />
        </button>
        {localStorage.getItem('isAdmin') && (
        <button onClick={() => history.push('/command')}>
          <TerminalIcon fontSize='large' />
        </button>)}
        <button onClick={() => history.push('/history')}>
          <AttributionIcon fontSize='large' />
        </button>
        <button onClick={() => history.push('/osys')}>
          <SettingsSystemDaydreamIcon fontSize='large' />
        </button>
        {localStorage.getItem('isAdmin') && (
          <button onClick={() => history.push('/administration')}>
            <SupervisorAccountIcon fontSize='large' />
          </button>
        )}

        <div className="select-dropdown">
          <select value={selectedOption} onChange={handleOptionChange}>
            <option value="">CRUD</option>
            <option value="crud-command">Command</option>
            <option value="crud-option">Option</option>
            <option value="crud-attribution">Attribution</option>
          </select>
        </div>
        <button>
          <LogoutIcon className='logout-button' fontSize='large' onClick={handleLogout} />
        </button>
      </div>
    ) : null
  );
}

export default Sidebar;
