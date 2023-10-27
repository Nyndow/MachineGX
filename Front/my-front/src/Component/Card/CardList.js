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
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchScriptData, 2000);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    if ((cardData.filter(machine => machine.state===true)).length > 0) {
      setConnected(true);
    }
    else{setConnected(false)}
  },);  

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

  const fetchScriptData = () => {
    const updatedCardData = [...cardData];

    updatedCardData.forEach(async (machine, i) => {
      if (machine.state === true) {
        try {
          const response = await axios.get(`${apiUrl}/execute-script/${machine.idUser}`, {
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
          }
          setCardData(updatedCardData);
        } catch (error) {
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
        idMachine : machine.idMachine,
      };
      axios
        .post(`${apiUrl}/connect/${machine.idUser}`, requestData)
        .then(() => {
          updatedCardData[i] = { ...machine, state: true };
          setCardData(updatedCardData);
        })
        .catch((error) => {
          console.error('Error updating machine state:', error);
        });
    }
  };

  const handleSuccessfulDisconnect = () => {
    fetchData()
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
      <div className='option-list'>
        <div className='test-align'>

          <div className='right-buttons'>
          <Link to={`/machine`}>  
                  <Button size='large' variant="outlined" startIcon={<ComputerIcon />}>
                    New
                  </Button>
          </Link>
            <Button variant="outlined" size="large" color="success" onClick={updateMachineState}>
              Connect
            </Button>
            <DropdownButton onSuccessfulDisconnect={handleSuccessfulDisconnect} statusConnection={connected} selectedData={cardData.filter(machine => machine.state===true)} />

          </div>
        </div>
      <hr/>
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
              idUser = {card.idUser}
              freeRAM={card.script_data?.FreeMemory || "0"}
              totalRAM={card.script_data?.TotalMemory || "0 GB"}
              DownUsage={card.script_data?.DownloadSpeed || "0 KB/s"}
              UpUsage={card.script_data?.UploadSpeed || "0 KB/s"}
              CPUUsage={card.script_data?.CPUUsage || "0%"}
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