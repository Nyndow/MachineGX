import React, { useState, useEffect } from 'react';
import CardItem from './CardItem';
import axios from 'axios';
import '../../Styles/CardList.css';
import PaginationComponent from '../Services/Pagination';

const CardList = () => {
  const [cardData, setCardData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 16;

  useEffect(() => {
    fetchData(); // Fetch data initially
  }, []);

  useEffect(() => {
    // When the component mounts or cardData changes, update localStorage
    localStorage.setItem('machineStates', JSON.stringify(cardData));
  }, [cardData]);

  useEffect(() => {
    // When the component mounts, check if there are stored machine states in localStorage
    const storedMachineStates = localStorage.getItem('machineStates');
    if (storedMachineStates) {
      setCardData(JSON.parse(storedMachineStates));
    }
  }, []);

  const fetchData = () => {
    const apiUrl = process.env.REACT_APP_API_URL;
    axios
      .get(`${apiUrl}/machineList`)
      .then((response) => {
        if (response.data && response.data.machineHome) {
          const machinesWithState = response.data.machineHome.map((machine) => ({
            ...machine,
            state: 'down',
          }));
          setCardData(machinesWithState);
        } else {
          console.error('Invalid API response format:', response.data);
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  };

  const updateMachineState = async () => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const updatedCardData = [...cardData]; // Create a copy of the existing data
  
    for (let i = 0; i < updatedCardData.length; i++) {
      const machine = updatedCardData[i];
      try {
        const response = await axios.post(`${apiUrl}/connect/${machine.idMachine}`);
        console.log('Machine state updated:', response);
        updatedCardData[i] = { ...machine, state: 'up' }; // Update the state to 'up' in the copy
      } catch (error) {
        console.error('Error updating machine state:', error);
      }
    }
  
    setCardData(updatedCardData); // Update the state with the modified data
  };

  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return cardData.slice(startIndex, endIndex);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="card-list">
      {getPaginatedData().map((card) => (
        <div key={card.idMachine} className="card-item-container">
          <CardItem
            title={card.machineName}
            description={card.ipAddr}
            imageUrl={card.imgOS}
            idMachine={card.idMachine}
            state={card.state}
          />
        </div>
      ))}
      <button onClick={updateMachineState}>Update State for All Machines</button>
      <div className="pagination-container">
        <PaginationComponent
          currentPage={currentPage}
          totalPages={Math.ceil(cardData.length / itemsPerPage)}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default CardList;
