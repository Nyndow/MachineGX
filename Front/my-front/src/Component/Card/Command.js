import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../Styles/Command.css';

function Command({ idOS, idMachine }) {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [data, setData] = useState([]);
  const [selectedOption, setSelectedOption] = useState('');
  const [secondSelectData, setSecondSelectData] = useState([]);
  const [selectedSecondOption, setSelectedSecondOption] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [showInput, setShowInput] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(`${apiUrl}/commandList/${idOS}`);
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, [idOS]);

  useEffect(() => {
    if (selectedOption) {
      async function fetchSecondSelectData() {
        try {
          const response = await axios.get(`${apiUrl}/optionByCmd/${selectedOption}`);
          setSecondSelectData(response.data);
        } catch (error) {
          console.error('Error fetching second select data:', error);
        }
      }

      fetchSecondSelectData();
    } else {
      setSecondSelectData([]);
      setSelectedSecondOption('');
    }
  }, [selectedOption]);

  const handleSelectChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedOption(selectedValue);
  };

  const handleSecondSelectChange = (event) => {
    const selectedItemId = event.target.value;
    const selectedItem = secondSelectData.find((item) => item.idOption == selectedItemId);

    if (selectedItem && selectedItem.targetIn) {
      setShowInput(true);
    } else {
      setShowInput(false);
    }

    setSelectedSecondOption(selectedItemId);
  };

  const handleInputValueChange = (event) => {
    setInputValue(event.target.value);
  };

  const handlePostData = () => {
    const postData = {
      selectedOption,
      selectedSecondOption,
      inputData: inputValue,
    };

    axios
      .post(`${apiUrl}/launch-command/${idMachine}`, postData)
      .then((response) => {
        console.log('Success:', response);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <div className="command-container">
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
            <option value="">Select option</option>
            {secondSelectData.map((item) => (
              <option key={item.idOption} value={item.idOption}>
                {item.optionDescription}
              </option>
            ))}
          </select>
          {showInput && (
            <input
              type="text"
              placeholder="Enter the target"
              value={inputValue}
              onChange={handleInputValueChange}
            />
          )}
          <button onClick={handlePostData}>OK!</button>
        </div>
      )}
    </div>
  );
}

export default Command;
