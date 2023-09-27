import React, { useState, useEffect } from 'react';
import '../../Styles/Command.css';
import axios from 'axios';

function Command({ idOS }) {
  const [data, setData] = useState([]);
  const [selectedOption, setSelectedOption] = useState('');
  const [secondSelectData, setSecondSelectData] = useState([]);
  const [selectedSecondOption, setSelectedSecondOption] = useState('');
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
  }, [idOS]);

  useEffect(() => {
    if (selectedOption) {
      axios.get(`${apiUrl}/optionByCmd/${selectedOption}`)
        .then((response) => {
          setSecondSelectData(response.data);
        })
        .catch((error) => {
          console.error('Error fetching second select data:', error);
        });
    } else {
      setSecondSelectData([]);
      setSelectedSecondOption('');
    }
  }, [selectedOption]);

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleSecondSelectChange = (event) => {
    setSelectedSecondOption(event.target.value);
  };

  const handlePostData = () => {
    const postData = {
      selectedOption,
      selectedSecondOption,
    }; 

    axios.post(`${apiUrl}/launch-command/`)
    .then((response) => {
    console.log("success : ", response)//A modifier pour afficher les données en bas
  })
    .catch((error) =>{
      console.log(error)
    })
  }

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

      {selectedOption && (
        <div>
          <select value={selectedSecondOption} onChange={handleSecondSelectChange}>
            <option value="">Select a second option</option>
            {secondSelectData.map((item) => (
              <option key={item.idOption} value={item.idOption}>
                {item.optionDescription}
              </option>
            ))}
          </select>
          <button onClick={handlePostData}>OK!</button>
        </div>
      )}
    </div>
  );
}

export default Command;
