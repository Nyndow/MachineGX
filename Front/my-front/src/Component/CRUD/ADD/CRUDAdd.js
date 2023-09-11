import React from 'react';
import { useParams } from 'react-router-dom'; // Import useParams to get URL parameters
import CRUDAddForm from './CRUDAddForm';

const AddAdmin = () => {
  const { entity } = useParams(); // Get the 'entity' parameter from the URL
  
  let columns = [];

  switch (entity) {
    case 'user':
      columns = ['numEmployee','userUsername', 'userPassword'];
      break;
  
    case 'administration':
      columns = ['adminUsername','numEmployee', 'adminPassword'];
      break;
  
    case 'machine':
      columns = ['machineName','os', 'ram', 'cpu', 'hdd','ipAddr'];
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
