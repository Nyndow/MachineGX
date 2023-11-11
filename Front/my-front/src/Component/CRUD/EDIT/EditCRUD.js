import React from 'react';
import { useParams } from 'react-router-dom';
import CRUDEditForm from './CRUDEditForm';

function EditCRUD() {
  const { entity, id } = useParams(); // Get entity and id from the URL parameters

  let columns = [];

  switch (entity) {
    case 'attribution':
      columns = ['dateDebut', 'dateFin'];
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
