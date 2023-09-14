import '../../../Styles/CRUDAddForm.css';
import React, { useState } from 'react';
import axios from 'axios';
import { isValid, parseISO } from 'date-fns'; 

const CRUDAddForm = ({ entity, columns }) => {
  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

const onSubmit = (data) => {
  const apiUrl = process.env.REACT_APP_API_URL;

  const dateString = data.dateHistory;
  const dateObject = new Date(dateString);
  data.dateHistory = dateObject;
  console.log(data.dateHistory)

  axios.post(`${apiUrl}/${entity}/`, data)
    .then((response) => {
      console.log('Entity updated:', response.data);
    })
    .catch((error) => {
      console.error('Error updating entity:', error);
    });
};

  // Render a date input field if the column is a date
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
      <h2 className="crud-form-title">Create {entity}</h2>
      {columns.map((column) => (
        <div key={column} className="input-group">
          <label className="crud-form-label" htmlFor={column}>
            {column}:
          </label>
          {renderInput(column)}
        </div>
      ))}
      <button className="crud-form-button" type="submit">
        Create
      </button>
    </form>
  );
};

export default CRUDAddForm;
