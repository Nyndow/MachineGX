import React, { useState, useEffect } from 'react';
import CardItem from './CardItem';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import '../../Styles/CardList.css';
import PaginationComponent from '../Services/Pagination';
import ComputerIcon from '@mui/icons-material/Computer';
import UploadIcon from '@mui/icons-material/Upload';
import ClearIcon from '@mui/icons-material/Clear';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const CardList = () => {
  const [cardData, setCardData] = useState([]);
  const apiUrl = process.env.REACT_APP_API_URL;
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const history = useHistory();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const connectedMachines = cardData.filter((machine) => machine.state === 'up');
  const [isPopupOpen, setIsPopupOpen] = useState(false);

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
      axios
        .post(`${apiUrl}/connect/${machine.idMachine}`, requestData)
        .then(() => {
          updatedCardData[i] = { ...machine, state: 'up' };
          setCardData(updatedCardData);
        })
        .catch((error) => {
          console.error('Error updating machine state:', error);
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
    setSelectedFiles((prevSelectedFiles) => [...prevSelectedFiles, ...e.target.files]);
  };
  

  const uploadFile = async (file, machineId, userUsername) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post(`${apiUrl}/transfer-script/${machineId}?userUsername=${userUsername}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
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

  const removeFile = (index) => {
    const updatedSelectedFiles = [...selectedFiles];
    updatedSelectedFiles.splice(index, 1);
    setSelectedFiles(updatedSelectedFiles);
  };

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });

  return (
    <div className="card-list">
      <div className='option-list'>
        <div className='test-align'>
          <div className='left-option'>
            <button className="new-button" onClick={() => history.push('/machine')}>
              <ComputerIcon />
              <span className="text">New</span>
            </button>
          </div>
          <div className='right-buttons'>
            <Button onClick={togglePopup} color="secondary" size="large" component="label" variant="outlined" startIcon={<CloudUploadIcon />}>
              Upload
              <VisuallyHiddenInput type="file" />
            </Button>
            <button onClick={updateMachineState} className='connectButton'>Connect</button>
            <button onClick={disconnectAllMachines} className='disconnectButton'>Disconnect</button>
          </div>
        </div>
      {/* Upload Section */}
        <div className="popup-container">
        {isPopupOpen && (
          <div className="popup">
            <div className="popup-content">
            <ClearIcon onClick={() => togglePopup()} className='close-icon'/>
              <div className="custom-file">
                <input type="file" multiple onChange={handleFileSelect} id="fileInput" className="custom-file-input" />
                <label htmlFor="fileInput" className="custom-file-label">Click here to choose files to upload</label>
              </div>
              <hr></hr>
              {selectedFiles.length > 0 && (
                <div className="selected-files-container">
                  {selectedFiles.map((file, index) => (
                    <div className="file-box" key={index}>
                          <div className="clear-button-container">
                            <ClearIcon onClick={() => removeFile(index)} fontSize="small" className="clear-icon" />
                          </div>
                      {file.type.startsWith('image') ? (
                        <img src={URL.createObjectURL(file)} alt={file.name} />
                      ) : file.type.startsWith('video') ? (
                        <video controls>
                          <source src={URL.createObjectURL(file)} type={file.type} />
                        </video>
                      ) : (
                        <p>{file.name}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
              <hr></hr>
              <div className="send-button">
                <button onClick={uploadFiles}>Upload</button>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Ending upload Section */}
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