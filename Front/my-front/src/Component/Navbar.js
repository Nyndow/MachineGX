import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import "../Styles/Sidebar.css";
import HomeIcon from "../Utils/icons/home.png";
import CommandIcon from "../Utils/icons/icons8-time-machine-50.png";
import TerminalIcon from "../Utils/icons/settings.png";
import Logout from "../Utils/icons/exit.png";

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
          <img src={HomeIcon} alt="Home" />
        </button>
        <button onClick={() => history.push('/machine-all')}>
          <img src={TerminalIcon} alt="machine" />
        </button>
        <button onClick={() => history.push('/history')}>
          <img src={CommandIcon} alt="History" />
        </button>
        <div className="select-dropdown">
          <select value={selectedOption} onChange={handleOptionChange}>
            <option value="">CRUD</option>
            {localStorage.getItem('isAdmin') && <option value="crud-administration">Administration</option>}
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
