import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TextField from '@mui/material/TextField';

const CRUDEditForm = ({ entity, columns, entityId }) => {
  const [formData, setFormData] = useState({});
  const apiUrl = process.env.REACT_APP_API_URL;

  // Fetch data when component mounts or entity/entityId changes
  useEffect(() => {
    axios.get(`${apiUrl}/${entity}/${entityId}`)
      .then((response) => {
        setFormData({ ...response.data });
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, [entityId, entity, apiUrl]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Submit updated data
  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`${apiUrl}/${entity}/${entityId}`, formData)
      .then((response) => {
        console.log('Entity updated:', response.data);
      })
      .catch((error) => {
        console.error('Error updating entity:', error);
      });
  };

  // Render input based on column type
  const renderInput = (column) => {
    // Handle date fields
    if (['dateHistory', 'dateDebut', 'dateFin'].includes(column)) {
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
    }

    // Default text/password fields
    return (
      <TextField
        id={column}
        name={column}
        label={column}
        variant="standard"
        type={column === 'userPassword' ? 'password' : 'text'}
        value={formData[column] || ''}
        onChange={handleChange}
        fullWidth
      />
    );
  };

  return (
    <form className="crud-form-container" onSubmit={handleSubmit}>
      <h2 className="crud-form-title">Edit {entity}</h2>
      {columns.map((column) => (
        <div key={column} className="input-group">
          {renderInput(column)} {/* Only pass 1 argument */}
        </div>
      ))}
      <button className="crud-form-button" type="submit">
        Update
      </button>
    </form>
  );
};

export default CRUDEditForm;