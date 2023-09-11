import React from 'react';
import { useParams } from 'react-router-dom';
import CRUDEditForm from './CRUDEditForm';

function EditCRUD() {
  const { entity, id } = useParams(); // Get entity and id from the URL parameters

  let columns = [];

  switch (entity) {
    case 'user':
      columns = ['numEmployee','userUsername','userPassword'];
      break;
  
    case 'administration':
      columns = ['numEmployee','adminUsername','adminPassword'];
      break;
  
    case 'machine':
      columns = ['machineName','os','ram','cpu','hdd','ipAddr'];
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
