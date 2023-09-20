import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import NavBarApp from './Navbar';
import Command from './Command';
import Machine from './Machine';
import History from './History';
import * as CRUDGeneral from './CRUD/GENERAL';
import LoginForm from './LoginForm';
import NotFound from './NotFound';
import AddAdmin from './CRUD/ADD/CRUDAdd'
import EditCRUD from './CRUD/EDIT/EditCRUD';
import "../Styles/App.css"
import CardList from './Card/CardList';
import CardPage from './Card/CardPage';

function App() {
  return (
    <div className="app-container">
      <Router>
        <NavBarApp />
        <Switch>
          <Route path="/home" component={CardList} />
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
          <Route path="/crud-os" component={CRUDGeneral.CRUDOS} />
          
          {/*CRUDADD*/}
          <Route path="/add/:entity" component={AddAdmin} />

          {/*CRUDEDIT*/}
          <Route path="/edit/:entity/:id" component={EditCRUD} />

          {/*MACHINELIST ELEMENT*/}
          <Route path="/machineList/:idMachine" component={CardPage}/>

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
