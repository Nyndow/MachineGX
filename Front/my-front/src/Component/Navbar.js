import React from 'react';
import { Link } from 'react-router-dom';
import { Nav, NavDropdown } from 'react-bootstrap';
import "../Styles/Sidebar.css";
import HomeIcon from "../Utils/icons/home.png"
import CommandIcon from "../Utils/icons/icons8-time-machine-50.png"
import TerminalIcon from "../Utils/icons/terminal.png"



function Sidebar() {
  return (
    <div className='main-container'>
    <div className="sidebar">
      <Nav defaultActiveKey="/home" className="flex-column">
        <Nav.Item>
          <Nav.Link as={Link} to="/home">
            <img src={HomeIcon} alt="Home"/>
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={Link} to="/machine">
          <img src={TerminalIcon} alt="machine"/>
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={Link} to="/history">
          <img src={CommandIcon} alt="History"/>
          </Nav.Link>
        </Nav.Item>
        <NavDropdown title="CRUD">
          <NavDropdown.Item as={Link} to="/crud-machine">Machine</NavDropdown.Item>
          <NavDropdown.Item as={Link} to="/crud-user">User</NavDropdown.Item>
          <NavDropdown.Item as={Link} to="/crud-administration">Administration</NavDropdown.Item>
          <NavDropdown.Item as={Link} to="/crud-history">History</NavDropdown.Item>
          <NavDropdown.Item as={Link} to="/crud-command">Command</NavDropdown.Item>
          <NavDropdown.Item as={Link} to="/crud-option">Option</NavDropdown.Item>
          <NavDropdown.Item as={Link} to="/crud-os">OS</NavDropdown.Item>
          <NavDropdown.Item as={Link} to="/crud-attribution">Attribution</NavDropdown.Item>
        </NavDropdown>
      </Nav>
    </div>
    </div>
  );
}

export default Sidebar;
