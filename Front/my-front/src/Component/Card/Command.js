import React, { useState, useEffect } from 'react';
import '../../Styles/Command.css';
import axios from 'axios';

function Command({ idOS, idMachine }) {
  const [data, setData] = useState([]);
  const [selectedOption, setSelectedOption] = useState('');
  const [secondSelectData, setSecondSelectData] = useState([]);
  const [selectedSecondOption, setSelectedSecondOption] = useState('');
  const apiUrl = process.env.REACT_APP_API_URL;
  const [showInput, setShowInput] = useState(false);

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

  const fetchSecondSelectData = (selectedValue) => {
    if (selectedValue) {
      axios.get(`${apiUrl}/optionByCmd/${selectedValue}`)
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
  };

  const handleSelectChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedOption(selectedValue);
    fetchSecondSelectData(selectedValue);
  };

  const handleSecondSelectChange = (event) => {
    const selectedItemId = event.target.value; // Ensure selectedItemId is a string
    console.log("SelectedItemId:", selectedItemId);
    console.log("SecondSelectData:", secondSelectData);
  
    const selectedItem = secondSelectData.find((item) => item.idOption == selectedItemId);
    console.log("SelectedItem:", selectedItem);
  
    if (selectedItem && selectedItem.targetIn) {
      setShowInput(true);
    } else {
      setShowInput(false);
    }
  
    setSelectedSecondOption(selectedItemId);
  };
  
  

  const handlePostData = () => {
    const postData = {
      selectedOption,
      selectedSecondOption,
    }; 

    axios.post(`${apiUrl}/launch-command/${idMachine}`, postData)
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
            <option value="">Select option</option>
            {secondSelectData.map((item) => (
              <option key={item.idOption} value={item.idOption}>
                {item.optionDescription}
              </option>
            ))}
          </select>
          {showInput && <input type="text" placeholder="Enter something" />}
          <button onClick={handlePostData}>OK!</button>
        </div>
      )}
    </div>
  );
}

export default Command;
