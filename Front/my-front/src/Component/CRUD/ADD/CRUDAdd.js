import React from 'react';
import { useParams } from 'react-router-dom'; //Get from the URL
import CRUDAddForm from './CRUDAddForm';

const AddAdmin = () => {
  const { entity } = useParams();
  
  let columns = [];

  switch (entity) {
    case 'user':
      columns = ['numEmployee','userUsername', 'userPassword'];
      break;
  
    case 'administration':
      columns = ['adminUsername','numEmployee', 'adminPassword'];
      break;
  
    case 'machine':
      columns = ['machineName','idOS','ipAddr','portNumber'];
      break;

    case 'oSys':
      columns = ['nomOS','versionOS', 'imgOS'];
      break;
  
    case 'history':
      columns = ['idMachine', 'idAdmin', 'idOption', 'dateHistory'];
      break;
  
    case 'attribution':
      columns = ['idUser', 'idMachine', 'dateDebut', 'dateFin'];
      break;
  
    case 'command':
      columns = ['commandName','baseOS', 'commandDescription', 'commandComment'];
      break;

    case 'option':
      columns = ['idCommand', 'optionDescription', 'optionSyntax','optionComment','target'];
      break;
  
    default:
      columns = ['defaultColumn1', 'defaultColumn2'];
      break;
  }

  return (
    <div>
      <CRUDAddForm entity={entity} columns={columns} />
    </div>
  );
};

export default AddAdmin;
