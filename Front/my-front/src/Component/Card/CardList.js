//It's MemFree here but it's for the mem used

import React, { useState, useEffect } from 'react';
import CardItem from './CardItem';
import axios from 'axios';
import '../../Styles/CardList.css';
import PaginationComponent from '../Services/Pagination';

const CardList = () => {
  const [cardData, setCardData] = useState([]);
  const apiUrl = process.env.REACT_APP_API_URL;
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [selectedFiles, setSelectedFiles] = useState([]);
  const connectedMachines = cardData.filter((machine) => machine.state === 'up');

  useEffect(() => {
    fetchData();

    const intervalId = setInterval(fetchScriptData, 2000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const fetchData = () => {
    axios
      .get(`${apiUrl}/machineList`)
      .then((response) => {
        if (response.data && response.data.machineHome) {
          setCardData(response.data.machineHome);
        } else {
          console.error('Invalid API response format:', response.data);
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  };

  const fetchScriptData = () => {
    const updatedCardData = [...cardData];
  
    updatedCardData.forEach(async (machine, i) => {
      if (machine.state === 'up') {
        try {
          const response = await axios.get(`${apiUrl}/execute-script/${machine.idMachine}`, {
            params: {
              userUsername: machine.userUsername
            }
          });
  
          if (response.data && response.data.script_data) {
            updatedCardData[i] = {
              ...machine,
              script_data: {
                CPUUsage: response.data.script_data.CPUUsage,
                DownloadSpeed: response.data.script_data.DownloadSpeed,
                FreeMemory: response.data.script_data.FreeMemory,
                TotalMemory: response.data.script_data.TotalMemory,
                Unknown: response.data.script_data.Unknown,
                UploadSpeed: response.data.script_data.UploadSpeed,
              },
            };
          } 
          else {
            console.error('Invalid script_data response format:', response.data);
          }
          setCardData(updatedCardData);
        } catch (error) {
          console.error('Error fetching script_data:', error);
        }
      }
    });
  };
  
  fetchScriptData();
  
  

  const updateMachineState = async () => {
    const updatedCardData = [...cardData];
  
    for (let i = 0; i < updatedCardData.length; i++) {
      const machine = updatedCardData[i];
      const requestData = {
        userUsername: machine.userUsername,
        userPassword: machine.userPassword,
        ipAddr: machine.ipAddr, 
        portNumber: machine.portNumber,
      };
      console.log('Sending POST request for machine:', machine.idMachine);
      axios
        .post(`${apiUrl}/connect/${machine.idMachine}`, requestData)
        .then(() => {
          updatedCardData[i] = { ...machine, state: 'up' };
          setCardData(updatedCardData);
          console.log('POST request successful for machine:', machine.idMachine);
        })
        .catch((error) => {
          console.error('Error updating machine state:', error);
          console.log('POST request failed for machine:', machine.idMachine);
        });      
    }
  };

  const disconnectAllMachines = async () => {
    try {
      for (let i = 0; i < connectedMachines.length; i++) {
        const machine = connectedMachines[i];
        await axios.post(`${apiUrl}/disconnect/${machine.idMachine}`);
      }
      
      const updatedCardData = cardData.map((machine) => ({
        ...machine,
        state: 'down',
      }));
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

  const uploadFile = async (file, machineId, userUsername) => {
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      const response = await axios.post(`${apiUrl}/transfer-script/${machineId}?userUsername=${userUsername}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(`File uploaded to machine ${machineId} for user ${userUsername}:`, response);
    } catch (error) {
      console.error(`Error uploading file to machine ${machineId} for user ${userUsername}:`, error);
    }
  };
  
  const uploadFiles = async () => {
    try {
      for (const machine of connectedMachines) {
        const promises = selectedFiles.map((file) => uploadFile(file, machine.idMachine, machine.userUsername));
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
          idOS={card.idOS}
          machineName={card.machineName}
          numEmployee={card.numEmployee}
          userUsername={card.userUsername}
          imageUrl={card.imgOS}
          idMachine={card.idMachine}
          state={card.state}
          freeRAM={card.script_data?.FreeMemory || "0"}
          totalRAM={card.script_data?.TotalMemory || "0 GB"}
          DownUsage={card.script_data?.DownloadSpeed || "0 KB/s"}
          UpUsage={card.script_data?.UploadSpeed || "0 KB/s"}
          CPUUsage={card.script_data?.CPUUsage || "0%"}
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