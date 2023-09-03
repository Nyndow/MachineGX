import React from 'react';
import { useParams } from 'react-router-dom';
import CRUDEditForm from './CRUDEditForm';

function EditCRUD() {
  const { entity, id } = useParams(); // Get entity and id from the URL parameters

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
      {/* Render the CRUDEditForm component */}
      <CRUDEditForm
        entity={entity} 
        columns={columns}
        entityId={id}
      />
    </div>
  );
}

export default EditCRUD;
