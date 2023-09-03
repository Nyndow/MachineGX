import React from 'react';
import { useParams } from 'react-router-dom'; // Import useParams to get URL parameters
import CRUDAddForm from './CRUDAddForm';

const AddAdmin = () => {
  const { entity } = useParams(); // Get the 'entity' parameter from the URL
  
  let columns = [];

  switch (entity) {
    case 'user':
      columns = ['username', 'password'];
      break;
  
    case 'administration':
      columns = ['username', 'password'];
      break;
  
    case 'machine':
      columns = ['os', 'type', 'ram', 'cpu', 'hdd'];
      break;
  
    case 'history':
      columns = ['idMachine', 'idAdmin', 'idOption', 'dateHistory'];
      break;
  
    case 'attribution':
      columns = ['idEmployee', 'idMachine', 'dateDebut', 'dateFin'];
      break;
  
    case 'command':
      columns = ['command', 'description', 'options'];
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
