import React from 'react';
import { useParams } from 'react-router-dom'; //Get from the URL
import CRUDAddForm from './CRUDAddForm';

const AddAdmin = () => {
  const { entity } = useParams();
  
  let columns = [];

  switch (entity) {
    case 'administration':
      columns = ['adminUsername','numEmployee', 'adminPassword'];
      break;

    case 'oSys':
      columns = ['nomOS','versionOS', 'imgOS'];
      break;
  
    case 'history':
      columns = ['idMachine', 'idAdmin', 'idOption', 'dateHistory','target'];
      break;
  
    case 'attribution':
      columns = ['idUser', 'idMachine', 'dateDebut', 'dateFin'];
      break;
  
    case 'command':
      columns = ['commandName','idBaseOsys', 'commandDescription', 'commandComment'];
      break;

    case 'option':
      columns = ['idCommand', 'optionDescription', 'optionSyntax','optionComment','targetIn'];
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
