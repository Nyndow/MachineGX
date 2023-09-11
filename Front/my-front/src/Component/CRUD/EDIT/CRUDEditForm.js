// Import the necessary modules and components at the beginning of CRUDEditForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CRUDEditForm = ({ entity, columns, entityId }) => {
  const [formData, setFormData] = useState({});

  // Initialize the form data with the fetched data
  useEffect(() => {
    const apiUrl = process.env.REACT_APP_API_URL;
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
    // You can perform form validation here
    onSubmit(formData);
  };

  // Replace onSubmit with the actual submit function
  const onSubmit = (data) => {
    const apiUrl = process.env.REACT_APP_API_URL;
    // Implement your submit logic here, e.g., make a PUT request to update the entity
    axios.put(`${apiUrl}/${entity}/${entityId}`, data)
      .then((response) => {
        // Handle successful update
        console.log('Entity updated:', response.data);
      })
      .catch((error) => {
        // Handle errors
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
          required
        />
      );
    } else {
      return (
        <input
          className="crud-form-input"
          type="text"
          id={column}
          name={column}
          value={formData[column] || ''}
          onChange={handleChange}
          required
        />
      );
    }
  };
  

  return (
    <form className="crud-form-container" onSubmit={handleSubmit}>
      <h2 className="crud-form-title">Edit {entity}</h2>
      {columns.map((column) => (
        <div key={column} className="input-group">
          <label className="crud-form-label" htmlFor={column}>
            {column}:
          </label>
          {renderInput(column, formData, handleChange)} {/* Use the renderInput function */}
        </div>
      ))}
      <button className="crud-form-button" type="submit">
        Update
      </button>
    </form>
  );
};

export default CRUDEditForm;
