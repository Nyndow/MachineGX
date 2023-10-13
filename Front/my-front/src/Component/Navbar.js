import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Nav, NavDropdown } from 'react-bootstrap';
import "../Styles/Sidebar.css";
import HomeIcon from "../Utils/icons/home.png";
import CommandIcon from "../Utils/icons/icons8-time-machine-50.png";
import TerminalIcon from "../Utils/icons/terminal.png";

function Sidebar() {
  const history = useHistory();
  const [authenticated, setAuthenticated] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setAuthenticated(false); 
    history.push('/login');
  };

  return (
    authenticated ? ( 
      <div className='main-container'>
        <div className="sidebar">
          <Nav defaultActiveKey="/" className="flex-column">
            <Nav.Item>
              <Nav.Link as={Link} to="/home">
                <img src={HomeIcon} alt="Home" />
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as={Link} to="/machine">
                <img src={TerminalIcon} alt="machine" />
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as={Link} to="/history">
                <img src={CommandIcon} alt="History" />
              </Nav.Link>
            </Nav.Item>
            <NavDropdown title="CRUD">
            <NavDropdown.Item as={Link} to="/crud-machine">Machine</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/crud-user">User</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/crud-administration">Administration</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/crud-command">Command</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/crud-option">Option</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/crud-os">OS</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/crud-attribution">Attribution</NavDropdown.Item>
            </NavDropdown>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </Nav>
        </div>
      </div>
    ) : null
  );
}

export default Sidebar;
