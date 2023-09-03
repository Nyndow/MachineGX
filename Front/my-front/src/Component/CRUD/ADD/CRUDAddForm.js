import '../../../Styles/CRUDAddForm.css'; // Import the CSS file
import React, { useState } from 'react';
import axios from 'axios';

const CRUDAddForm = ({ entity, columns }) => {
  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can perform form validation here
    onSubmit(formData);
  };

  const onSubmit = (data) => {
    const apiUrl = process.env.REACT_APP_API_URL;
    // Implement your submit logic here, e.g., make a POST request to update the entity
    axios.post(`${apiUrl}/${entity}/`, data)
      .then((response) => {
        // Handle successful update
        console.log('Entity updated:', response.data);
      })
      .catch((error) => {
        // Handle errors
        console.error('Error updating entity:', error);
      });
  };

  return (
    <form className="crud-form-container" onSubmit={handleSubmit}>
      <h2 className="crud-form-title">Create {entity}</h2>
      {columns.map((column) => (
        <div key={column} className="input-group">
          <label className="crud-form-label" htmlFor={column}>
            {column}:
          </label>
          <input
            className="crud-form-input"
            type="text"
            id={column}
            name={column}
            value={formData[column] || ''}
            onChange={handleChange}
            required
          />
        </div>
      ))}
      <button className="crud-form-button" type="submit">
        Create
      </button>
    </form>
  );
};

export default CRUDAddForm;
