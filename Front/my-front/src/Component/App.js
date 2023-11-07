import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Sidebar from './Navbar';
import MachineOption from './CRUD/ADD/MachineOption';
import History from './History/History';
import * as CRUDGeneral from './CRUD/GENERAL';
import LoginForm from './LoginForm';
import NotFound from './NotFound';
import AddAdmins from './CRUD/ADD/CRUDAdd';
import EditCRUD from './CRUD/EDIT/EditCRUD';
import MachineEdit from './CRUD/EDIT/MachineEdit';
import "../Styles/App.css"
import CardList from './Card/CardList';
import CardPage from './Card/CardPage';
import PrivateRoute from './Services/privateAuth';
import PrivateAdminRoute from './Services/privateAdminAuth';
import UserAdd from './CRUD/ADD/UserAdd';
import User from './CRUD/GENERAL/User';
import UserEdit from './CRUD/EDIT/UserEdit';
import MachineAll from './CRUD/GENERAL/MachineAll';
import AdminAdd from './CRUD/ADD/AdminAdd';
import AdminEdit from './CRUD/EDIT/AdminEdit';
import Admin from './CRUD/GENERAL/Admin';
import CommandAll from './CRUD/GENERAL/Command/CommandAll';
import OS from './CRUD/GENERAL/OS.js/OS';
import OSAdd from './CRUD/ADD/OS/OSAdd';
import OSEdit from './CRUD/EDIT/OS/OSEdit';
import BaseOS from './CRUD/GENERAL/OS.js/BaseOS';
import BaseOSEdit from './CRUD/EDIT/OS/BaseOSEdit';
import BaseOsAdd from './CRUD/ADD/OS/BaseOSAdd';
import AttributionAdd from './CRUD/ADD/AttributionAdd';

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
          <PrivateRoute path="/home" component={CardList} />
          <PrivateRoute path="/history" component={History} />

          {/*CRUD GENERAL*/} 
          <PrivateRoute path="/machine-all" component={MachineAll}/>
          <PrivateAdminRoute path="/administration" component={Admin}/>
          <PrivateRoute path="/users_machine/:idMachine" component={User} />
          <PrivateRoute path="/osys" component={OS} />
          <PrivateRoute path="/base_osys" component={BaseOS} />
          <PrivateRoute path="/command" component={CommandAll} />
          <PrivateRoute path="/crud-attribution" component={CRUDGeneral.CRUDAttribution} />
          
          {/*CRUDADD*/}
          <PrivateRoute path="/add/:entity" component={AddAdmins} />
          <PrivateRoute path="/user_add/:idMachine" component={UserAdd}/>
          <PrivateAdminRoute path="/admin_add/" component={AdminAdd}/>
          <PrivateRoute path="/machine" component={MachineOption} />
          <PrivateRoute path="/osys_add" component={OSAdd} />
          <PrivateRoute path="/base_osys_add" component={BaseOsAdd} />
          <PrivateRoute path="/attribution_add" component={AttributionAdd}/>

          {/*CRUDEDIT*/}
          <PrivateRoute path="/edit/:entity/:id" component={EditCRUD} />
          <PrivateAdminRoute path="/admin_edit/:idAdmin" component={AdminEdit}/>
          <PrivateRoute path="/user_edit/:idUser" component={UserEdit} />
          <PrivateRoute path="/osys_edit/:idOS" component={OSEdit} />
          <PrivateRoute path="/base_osys_edit/:idBaseOsys" component={BaseOSEdit} />
          <PrivateRoute path="/editMachine/:idMachine" component={MachineEdit} />

          {/*MACHINELIST ELEMENT*/}
          <PrivateRoute path="/machine-page/:idMachine/:idOS" component={CardPage} />;

          <PrivateRoute component={NotFound} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
