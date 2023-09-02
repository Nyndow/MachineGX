import React from 'react';
import { BrowserRouter as Router,Link, Switch, Route } from 'react-router-dom';
import { Navbar, Container, Nav, NavDropdown, Button, Form } from 'react-bootstrap';

// Import the components corresponding to your routes
import Home from './Home';
import Command from './Command';
import Machine from './Machine';
import History from './History';
import CRUDMachine from './CRUD/CRUD-machine';
import CRUDEmployee from './CRUD/CRUD-employee';
import CRUDAttribution from './CRUD/CRUD-attribution';
import CRUDAdmin from './CRUD/CRUD-admin';
import CRUDHistory from './CRUD/CRUD-history'

function NavBarApp() {
  return (
    <Router>
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
                  <NavDropdown.Item as={Link} to="/crud-employee">Employee</NavDropdown.Item>
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
      <div>
        <Switch>
          <Route path="/home" component={Home} />
          <Route path="/command" component={Command} />
          <Route path="/machine" component={Machine} />
          <Route path="/history" component={History} />
          <Route path="/crud-machine" component={CRUDMachine} />
          <Route path="/crud-employee" component={CRUDEmployee} />
          <Route path="/crud-history" component={CRUDHistory} />
          <Route path="/crud-attribution" component={CRUDAttribution} />
          <Route path="/crud-administration" component={CRUDAdmin} />
        </Switch>
      </div>
    </Router>
  );
}

export default NavBarApp;
