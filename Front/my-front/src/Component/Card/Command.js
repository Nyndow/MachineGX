import React, { useState, useEffect } from 'react';
import '../../Styles/Command.css';
import axios from 'axios';

function Command({idOS}) {
  const [data, setData] = useState([]); 
  const [selectedOption, setSelectedOption] = useState(''); 
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    axios.get(`${apiUrl}/commandList/${idOS}`) 
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', idOS);
        console.error('Error fetching data:', error);
      });
  }, []);

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };
  return (
    <div className='command-container'>
      <select value={selectedOption} onChange={handleSelectChange}>
        <option value="">Select an option</option>
        {data.map((item) => (
          <option key={item.idCommand} value={item.idCommand}>
            {item.commandDescription}
          </option>
        ))}
      </select>
      <p>Selected Option: {selectedOption}</p>
    </div>
  );
}

export default Command;
