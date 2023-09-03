// Component/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Container, Nav, NavDropdown, Button, Form } from 'react-bootstrap';

function NavBarApp() {
  return (
    <div>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container fluid>
          <Navbar.Brand as={Link} to="/home">Home</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: '100px' }}
              navbarScroll
            >
              <Nav.Link as={Link} to="/command">Command</Nav.Link>
              <Nav.Link as={Link} to="/history">History</Nav.Link>
              <NavDropdown title="CRUD" id="navbarScrollingDropdown">
                <NavDropdown.Item as={Link} to="/crud-machine">Machine</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/crud-user">User</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/crud-administration">Administration</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/crud-history">History</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/crud-command">Command</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/crud-attribution">Attribution</NavDropdown.Item>
              </NavDropdown>
            </Nav>
            <Form className="d-flex">
              <Form.Control
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
              />
              <Button variant="outline-success">Search</Button>
            </Form>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
}

export default NavBarApp;
