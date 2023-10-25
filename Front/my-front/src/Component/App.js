import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Sidebar from './Navbar';
import MachineOption from './CRUD/ADD/MachineOption';
import History from './History/History';
import * as CRUDGeneral from './CRUD/GENERAL';
import LoginForm from './LoginForm';
import NotFound from './NotFound';
import AddAdmin from './CRUD/ADD/CRUDAdd';
import EditCRUD from './CRUD/EDIT/EditCRUD';
import MachineEdit from './CRUD/EDIT/MachineEdit';
import "../Styles/App.css"
import CardList from './Card/CardList';
import CardPage from './Card/CardPage';
import PrivateRoute from './Services/privateAuth';
import UserAdd from './CRUD/ADD/UserAdd';
import User from './CRUD/GENERAL/User';
import UserEdit from './CRUD/EDIT/UserEdit';

function App() {
  return (
    <div className="app-container">
      <Router>
        <Route path="/login" component={LoginForm} />
        <Route
          render={({ location }) =>
            location.pathname !== '/login' && <Sidebar />
          }
        />
        <Switch>
        <PrivateRoute path="/users_machine/:idMachine" component={User} />
        <PrivateRoute path="/user_edit/:idUser" component={UserEdit} />
          <PrivateRoute path="/home" component={CardList} />
          <PrivateRoute path="/machine" component={MachineOption} />
          <PrivateRoute path="/editMachine/:idMachine" component={MachineEdit} />
          <PrivateRoute path="/history" component={History} />

          {/*CRUD GENERAL*/}
          <PrivateRoute path="/crud-machine" component={CRUDGeneral.CRUDMachine} />
          <PrivateRoute path="/crud-command" component={CRUDGeneral.CRUDCommand} />
          <PrivateRoute path="/crud-user" component={CRUDGeneral.CRUDEmployee} />;
          <PrivateRoute path="/crud-attribution" component={CRUDGeneral.CRUDAttribution} />;
          <PrivateRoute path="/crud-administration" component={CRUDGeneral.CRUDAdmin} />;
          <PrivateRoute path="/crud-option" component={CRUDGeneral.CRUDOption} />;
          <PrivateRoute path="/crud-os" component={CRUDGeneral.CRUDOS} />;
          
          {/*CRUDADD*/}
          <PrivateRoute path="/add/:entity" component={AddAdmin} />
          <PrivateRoute path="/user_add/:idMachine" component={UserAdd}/>

          {/*CRUDEDIT*/}
          <PrivateRoute path="/edit/:entity/:id" component={EditCRUD} />

          {/*MACHINELIST ELEMENT*/}
          <PrivateRoute path="/machine-page/:idMachine/:idOS" component={CardPage} />;

          <PrivateRoute component={NotFound} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
