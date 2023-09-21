import React, { useState, useEffect } from 'react';
import CardItem from './CardItem';
import axios from 'axios';
import '../../Styles/CardList.css';
import PaginationComponent from '../Services/Pagination';

const CardList = () => {
  const [cardData, setCardData] = useState([]);
  const apiUrl = process.env.REACT_APP_API_URL;
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 16;
  const [selectedFiles, setSelectedFiles] = useState([]);
  const connectedMachines = cardData.filter((machine) => machine.state === 'up');

  useEffect(() => {
    fetchData(); // Fetch data initially
  }, []);

  const fetchData = () => {
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
    const updatedCardData = [...cardData];
  
    for (let i = 0; i < updatedCardData.length; i++) {
      const machine = updatedCardData[i];
      try {
        const response = await axios.post(`${apiUrl}/connect/${machine.idMachine}`);
        console.log('Machine state updated:', response);
        updatedCardData[i] = { ...machine, state: 'up' }; 
      } catch (error) {
        console.error('Error updating machine state:', error);
      }
    }
  
    setCardData(updatedCardData); 
  };

  const disconnectAllMachines = async () => {
  
    try {
      for (let i = 0; i < connectedMachines.length; i++) {
        const machine = connectedMachines[i];
        await axios.post(`${apiUrl}/disconnect/${machine.idMachine}`);
      }
      const updatedCardData = cardData.map((machine) => {
        if (machine.state === 'up') {
          return {
            ...machine,
            state: 'down', 
          };
        }
        return machine;
      });
      setCardData(updatedCardData);
    } catch (error) {
      console.error('Error disconnecting connected machines:', error);
    }
  };
  
  
  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return cardData.slice(startIndex, endIndex);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleFileSelect = (e) => {
    setSelectedFiles([...e.target.files]);
  };

  const uploadFile = async (file, machineId) => {
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      const response = await axios.post(`${apiUrl}/transfer-script/${machineId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(`File uploaded to machine ${machineId}:`, response);
    } catch (error) {
      console.error(`Error uploading file to machine ${machineId}:`, error);
    }
  };
  
  const uploadFiles = async () => {
    try {
      for (const machine of connectedMachines) {
        const promises = selectedFiles.map((file) => uploadFile(file, machine.idMachine));
        await Promise.all(promises);
      }
      setSelectedFiles([]);
    } catch (error) {
      console.error('Error uploading files:', error);
    }
  };
  
    

  return (
    <div className="card-list">
      {getPaginatedData().map((card) => (
        <div key={card.idMachine} className="card-item-container">
          <CardItem
            title={card.machineName}
            description={card.numEmployee}
            description2={card.userUsername}
            imageUrl={card.imgOS}
            idMachine={card.idMachine}
            state={card.state}
          />
        </div>
      ))}
      <input type="file" multiple onChange={handleFileSelect} />
      <button onClick={uploadFiles} className='uploadButton'>Upload</button>
      <button onClick={updateMachineState}className='connectButton'>Connect</button>
      <button onClick={disconnectAllMachines}className='disconnectButton'>Disconnect</button>
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