import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TextField from '@mui/material/TextField';

const CRUDEditForm = ({ entity, columns, entityId }) => {
  const [formData, setFormData] = useState({});
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    axios.get(`${apiUrl}/${entity}/${entityId}`)
      .then((response) => {
        const formattedData = { ...response.data };
        setFormData(formattedData);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, [entityId, entity]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const onSubmit = (data) => {
    axios.put(`${apiUrl}/${entity}/${entityId}`, data)
      .then((response) => {
        console.log('Entity updated:', response.data);
      })
      .catch((error) => {
        console.error('Error updating entity:', error);
      });
  };

  const renderInput = (column) => {
    if (column === 'dateHistory' || column === 'dateDebut' || column === 'dateFin') {
      return (
        <input
          className="crud-form-input"
          type="datetime-local"
          id={column}
          name={column}
          value={formData[column] || ''}
          onChange={handleChange}
        />
      );
    } else {
      return (
<TextField
  id={column}
  name={column}
  label={column}
  variant="standard"
  type={column === 'userPassword' ? 'password' : 'text'}
  value={formData[column] || ''}
  onChange={(e) => handleChange(e, column)}
/>

      );
    }
  };
  

  return (
    <form className="crud-form-container" onSubmit={handleSubmit}>
      <h2 className="crud-form-title">Edit {entity}</h2>
      {columns.map((column) => (
        <div key={column} className="input-group">
          {renderInput(column, formData, handleChange)}
        </div>
      ))}
      <button className="crud-form-button" type="submit">
        Update
      </button>
    </form>
  );
};

export default CRUDEditForm;
