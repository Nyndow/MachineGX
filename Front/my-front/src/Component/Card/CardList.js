import React, { useState, useEffect } from 'react';
import CardItem from './CardItem';
import axios from 'axios';
import '../../Styles/CardList.css';
import PaginationComponent from '../Services/Pagination';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import ComputerIcon from '@mui/icons-material/Computer';
import DropdownButton from '../Services/DropButton';

const CardList = () => {
  const [cardData, setCardData] = useState([]);
  const apiUrl = process.env.REACT_APP_API_URL;
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if ((cardData.filter(machine => machine.state === true)).length > 0) {
    setConnected(true);
    const intervalId = setInterval(fetchScriptData, 2000);
    return () => {
      clearInterval(intervalId);
    };
  }}, [cardData]);

  useEffect(() => {
    if ((cardData.filter(machine => machine.state === true)).length > 0) {
    setConnected(true);
    const intervalId = setInterval(fetchInternet, 3000);
    return () => {
      clearInterval(intervalId);
    };
  }}, [cardData]);


  useEffect(() => {
    fetchData()
  },[]);

  const fetchData = () => {
    axios
      .get(`${apiUrl}/machineList`)
      .then((response) => {
        const updatedData = response.data.machineHome.map((machine) => ({
          ...machine,
          state: false,
        }));

        const verificationPromises = updatedData.map((machine) =>
          axios.get(`${apiUrl}/verify_conn/${machine.idUser}`)
        );

        Promise.all(verificationPromises)
          .then((verificationResponses) => {
            verificationResponses.forEach((response, index) => {
              if (response.data.success === true) {
                updatedData[index].state = true;
              }
            });

            setCardData(updatedData);
          })
          .catch((error) => {
            console.error('Error verifying connections:', error);
          });
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  };

  const fetchScriptData = async () => {
    const updatedCardData = [...cardData];
  
    for (let i = 0; i < updatedCardData.length; i++) {
      const machine = updatedCardData[i];
  
      if (machine.state === true) {
        try {
          const response = await axios.get(`${apiUrl}/execute-cpu/${machine.idUser}`);
  
          if (response.data) {
            console.log(response.data, 'id:', machine.userUsername);
  
            const updatedCPUUsage = response.data.CPUUsage > 90 ? 100 : Math.max(0, response.data.CPUUsage);
  
            updatedCardData[i] = {
              ...machine,
              cpu_data: {
                CPUUsage: updatedCPUUsage,
                TotalMemory: response.data.TotalMemory,
                UsedMemory: response.data.UsedMemory,
              },
            };
          }
        } catch (error) {
          console.error(error);
        }
      }
    }
  
    setCardData(updatedCardData);
  };

  const fetchInternet = async () => {
    const updatedCardData = [...cardData];
  
    for (let i = 0; i < updatedCardData.length; i++) {
      const machine = updatedCardData[i];
  
      if (machine.state === true) {
        try {
          const response = await axios.get(`${apiUrl}/execute-script/${machine.idUser}`);
  
          if (response.data.script_data) {

            updatedCardData[i] = {
              ...machine,
              script_data: {
                DownloadSpeed : response.data.script_data.DownloadSpeed, 
                UploadSpeed: response.data.script_data.UploadSpeed
                }
            };

          }
        } catch (error) {
          console.error(error);
        }
      }
    }
    setCardData(updatedCardData)
  };
  
  
  
  const updateMachineState = async () => {
    const updatedCardData = [...cardData];
  
    for (let i = 0; i < updatedCardData.length; i++) {
      const machine = updatedCardData[i];
      const requestData = {
        idMachine: machine.idMachine,
      };
  
      try {
        await axios.post(`${apiUrl}/connect/${machine.idUser}`, requestData);
        updatedCardData[i] = { ...machine, state: true };
      } catch (error) {
        // Handle error if needed
      }
  
      // Update state after each fetch
      setCardData([...updatedCardData]);
    }
  };
  
  

  const handleSuccessfulDisconnect = () => {
    fetchData();
  };

  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return cardData.slice(startIndex, endIndex);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const poweroff = () => {
    const selectedMachines = cardData.filter(machine => machine.state === true);
  
    for (let i = 0; i < selectedMachines.length; i++) {
      const machine = selectedMachines[i];
  
      axios
        .post(`${apiUrl}/poweroff/${machine.idUser}`)
        .then(() => {
        })
        .catch(error => {
          console.error("Error during poweroff request:", error);
        });
    }
    fetchData();
  };
  


  return (
    <div className="card-list">
      <div className='option-list'>
        <div className='test-align'>
          <div className='right-buttons' style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Link to={`/machine`}>
              <Button size='large' variant="outlined" startIcon={<ComputerIcon />}>
                New
              </Button>
            </Link>
            <Button variant="outlined" size="large" color="success" onClick={updateMachineState}>
              Connect
            </Button>
            <DropdownButton 
            onSuccessfulDisconnect={handleSuccessfulDisconnect} 
            statusConnection={connected} 
            poweroff={poweroff}
            selectedData={cardData.filter(machine => machine.state === true)} />
          </div>
        </div>
        <hr />
      </div>
      <div className='cardlist'>
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
              idUser={card.idUser}
              freeRAM={card.cpu_data?.UsedMemory || "0"}
              totalRAM={card.cpu_data?.TotalMemory || "0"}
              DownUsage={card.script_data?.DownloadSpeed || "0 KB/s"}
              UpUsage={card.script_data?.UploadSpeed || "0 KB/s"}
              CPUUsage={card.cpu_data?.CPUUsage || "0"}
            />
          </div>
        ))}
      </div>
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
