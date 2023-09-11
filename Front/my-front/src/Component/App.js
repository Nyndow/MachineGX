import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import NavBarApp from './Navbar';
import Home from './Home';
import Command from './Command';
import Machine from './Machine';
import History from './History';
import * as CRUDGeneral from './CRUD/GENERAL';
import LoginForm from './LoginForm';
import NotFound from './NotFound';
import AddAdmin from './CRUD/ADD/CRUDAdd'
import EditCRUD from './CRUD/EDIT/EditCRUD';
import "../Styles/App.css"

function App() {
  return (
    <div className="app-container">
      <Router>
        <NavBarApp />
        <Switch>
          <Route path="/home" component={Home} />
          <Route path="/command" component={Command} />
          <Route path="/machine" component={Machine} />
          <Route path="/history" component={History} />

          {/*CRUD GENERAL*/}
          <Route path="/crud-machine" component={CRUDGeneral.CRUDMachine} />
          <Route path="/crud-command" component={CRUDGeneral.CRUDCommand} />
          <Route path="/crud-user" component={CRUDGeneral.CRUDEmployee} />
          <Route path="/crud-history" component={CRUDGeneral.CRUDHistory} />
          <Route path="/crud-attribution" component={CRUDGeneral.CRUDAttribution} />
          <Route path="/crud-administration" component={CRUDGeneral.CRUDAdmin} />
          <Route path="/crud-option" component={CRUDGeneral.CRUDOption} />
          
          {/*CRUDADD*/}
          <Route path="/add/:entity" component={AddAdmin} />

          {/*CRUDEDIT*/}
          <Route path="/edit/:entity/:id" component={EditCRUD} />

          {/* Add the login route */}
          <Route path="/login" component={LoginForm} />

          {/* Add the Not Found route */}
          <Route component={NotFound} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
