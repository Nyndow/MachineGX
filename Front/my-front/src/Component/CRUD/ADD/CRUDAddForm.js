import React, { useState } from 'react';
import axios from 'axios';
import { isValid, parseISO } from 'date-fns';

import '../../../Styles/CRUDAddForm.css';

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
    console.log(data.dateHistory);

    axios
      .post(`${apiUrl}/${entity}/`, data)
      .then((response) => {
        console.log('Entity updated:', response.data);
      })
      .catch((error) => {
        console.error('Error updating entity:', error);
      });
  };

  //Render date
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

  // Render radio
  const renderRadioOptions = () => {
    if (entity === 'oSys') {
      return (
        <div className="input-group">
          <label className="crud-form-label">Select Option:</label>
          <label>
            <input
              type="radio"
              name="option"
              value="DEB"
              checked={formData.option === 'DEB'}
              onChange={handleChange}
            />
            DEB
          </label>
          <label>
            <input
              type="radio"
              name="option"
              value="ARC"
              checked={formData.option === 'ARC'}
              onChange={handleChange}
            />
            ARC
          </label>
          <label>
            <input
              type="radio"
              name="option"
              value="FED"
              checked={formData.option === 'FED'}
              onChange={handleChange}
            />
            FED
          </label>
          <label>
            <input
              type="radio"
              name="option"
              value="WIN"
              checked={formData.option === 'WIN'}
              onChange={handleChange}
            />
            WIN
          </label>
          <label>
            <input
              type="radio"
              name="option"
              value="OPE"
              checked={formData.option === 'OPE'}
              onChange={handleChange}
            />
            OPE
          </label>
        </div>
      );
    }
    return null;
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

      {renderRadioOptions()} 
      
      <button className="crud-form-button" type="submit">
        Create
      </button>
    </form>
  );
};

export default CRUDAddForm;
