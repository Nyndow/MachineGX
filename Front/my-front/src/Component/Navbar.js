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

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    history.push(option);
  };

  return (
    authenticated ? (
      <div className="sidebar">
        <button onClick={() => handleOptionClick('/')}>
          <HomeIcon fontSize='large' style={{ color: selectedOption === '/' ? 'blue' : 'black' }} />
        </button>
        <button onClick={() => handleOptionClick('/machine-all')}>
          <DevicesIcon fontSize='large' style={{ color: selectedOption === '/machine-all' ? 'blue' : 'black' }} />
        </button>
        <button onClick={() => handleOptionClick('/history')}>
          <HistoryIcon fontSize='large' style={{ color: selectedOption === '/history' ? 'blue' : 'black' }} />
        </button>
        {localStorage.getItem('isAdmin') && (
        <button onClick={() => handleOptionClick('/command')}>
          <TerminalIcon fontSize='large' style={{ color: selectedOption === '/command' ? 'blue' : 'black' }} />
        </button>)}
        <button onClick={() => handleOptionClick('/attribution')}>
          <AttributionIcon fontSize='large' style={{ color: selectedOption === '/attribution' ? 'blue' : 'black' }} />
        </button>
        <button onClick={() => handleOptionClick('/osys')}>
          <SettingsSystemDaydreamIcon fontSize='large' style={{ color: selectedOption === '/osys' ? 'blue' : 'black' }} />
        </button>
        {localStorage.getItem('isAdmin') && (
          <button onClick={() => handleOptionClick('/administration')}>
            <SupervisorAccountIcon fontSize='large' style={{ color: selectedOption === '/administration' ? 'blue' : 'black' }} />
          </button>
        )}
        <button>
          <LogoutIcon className='logout-button' fontSize='large' style={{ color: selectedOption === '/logout' ? 'blue' : 'black' }} onClick={handleLogout} />
        </button>
      </div>
    ) : null
  );
}

export default Sidebar;
