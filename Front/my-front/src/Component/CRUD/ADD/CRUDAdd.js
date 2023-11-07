import React from 'react';
import { useParams } from 'react-router-dom'; //Get from the URL
import CRUDAddForm from './CRUDAddForm';

const AddAdmin = () => {
  const { entity } = useParams();
  
  let columns = [];

  switch (entity) {
    case 'attribution':
      columns = ['machineName', 'userUsername', 'numEmployee', 'dateDebut','dateFin'];
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
