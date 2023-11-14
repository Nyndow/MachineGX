import React, { useState, useEffect } from 'react';
import '../../../Styles/MachineAll.css'; 
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import PaginationComponent from '../../Services/Pagination';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import MovingIcon from '@mui/icons-material/Moving';
import EditIcon from '@mui/icons-material/Edit';
import Button from '@mui/material/Button';
import ComputerIcon from '@mui/icons-material/Computer';
import ClearIcon from '@mui/icons-material/Clear';
import DropdownButton from '../../Services/DropButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';

function MachineAll() {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(11);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const apiUrl = process.env.REACT_APP_API_URL;
  const history = useHistory();
  const [showConnectedOnly, setShowConnectedOnly] = useState(false);

  useEffect(() => {
    fetchData()
  }, []);

  const fetchData = () =>{
    axios
    .get(`${apiUrl}/machineAll`)
    .then((response) => {
      const updatedData = response.data.machineAll.map((machine) => ({
        ...machine,
        connected: false,
      }));

      const verificationPromises = updatedData.map((machine) =>
        axios.get(`${apiUrl}/verify_conn/${machine.idUser}`)
      );

      Promise.all(verificationPromises)
        .then((verificationResponses) => {
          verificationResponses.forEach((response, index) => {
            if (response.data.success === true) {
              updatedData[index].connected = true;
            }
          });

          setData(updatedData);
        })
        .catch((error) => {
          console.error('Error verifying connections:', error);
        });
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
  }
  

  const changeShow = () => {
    if (!showConnectedOnly) {
      const connectedMachines = data.filter((machine) => machine.connected);
      setData(connectedMachines);
    } else {
      fetchData()
    }
    setShowConnectedOnly(!showConnectedOnly);
  };
  
  /*CONNECTION*/ 
  const handleConnect = async () => {
    const updatedCardData = [...data];
  
    for (let i = 0; i < updatedCardData.length; i++) {
      const machine = updatedCardData[i];
      const requestData = {
        idMachine: machine.idMachine,
      };
  
      try {
        await axios.post(`${apiUrl}/connect/${machine.idUser}`, requestData);
  
        updatedCardData[i] = { ...machine, connected: true };
  
        setData(updatedCardData);
      } catch (error) {
        console.error('Error updating machine state:', error);
      }
    }
  };

  /*DISCONNECT*/ 
  const handleSuccessfulDisconnect = () => {
    fetchData()
  };

  const poweroff = () => {
    const selectedMachines = data.filter(machine => machine.connected === true);
  
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

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handleItemSelect = (rowData) => {
    const newSelectedItems = new Set(selectedItems);
    if (newSelectedItems.has(rowData.idUser)) {
      newSelectedItems.delete(rowData.idUser);
    } else {
      newSelectedItems.add(rowData.idUser);
    }
    setSelectedItems(newSelectedItems);
  };
  
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems(new Set());
      setSelectAll(false);
    } else {
      const filteredData = data.filter((rowData) =>
        Object.values(rowData).some((value) =>
          value.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
      const allItemIds = filteredData.map((item) => item.idUser);
      setSelectedItems(new Set(allItemIds));
      setSelectAll(true);
    }
  };  

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredData = data.filter((rowData) =>
    Object.values(rowData).some((value) =>
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const dataToDisplay = filteredData.slice(startIndex, endIndex);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <div className='machineMain-container'>
      <div className="machine">
        <div className="machine-container">
          <div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div><TextField
              id="input-with-icon-textfield"
              label="Search"
              variant="outlined"
              type="text"
              style={{backgroundColor:'#110f18'}} 
              value={searchQuery}
              onChange={handleSearchInputChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  searchQuery && (
                    <InputAdornment position="end">
                      <IconButton onClick={handleClearSearch}>
                        <ClearIcon />
                      </IconButton>
                    </InputAdornment>
                  )
                ),
              }}
            />
                <IconButton onClick={changeShow}>
                  <SortIcon />
                </IconButton>
                </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Link to={`/machine`} style={{ marginRight: '10px' }}>
                <Button size='large' variant="outlined" startIcon={<ComputerIcon size='large' />}>
                  New
                </Button>
              </Link>
              <Button onClick={handleConnect} variant="outlined" color="success" style={{ marginRight: '10px' }}>
                Connect
              </Button>
              <DropdownButton
                selectedData={data.filter(machine => machine.connected === true)}
                statusConnection={data.filter(machine => machine.connected === true).length > 0}
                onSuccessfulDisconnect={handleSuccessfulDisconnect}
                poweroff={poweroff}
              />
            </div>
          </div>
          <div className="table-wrapper" style={{ marginTop: '20px' }}>
            <table className="machine-table">
              <thead style={{backgroundColor:'#110f18'}}>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAll}
                      className="select-all-checkbox"
                    />
                  </th>
                  <th>Machine</th>
                  <th>User</th>
                  <th>State</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {dataToDisplay.map((rowData, index) => (
                    <tr key={index} className='crud-table-row-even'>
                        <td>
                        <input
                            type="checkbox"
                            checked={selectedItems.has(rowData.idUser)}
                            onChange={() => handleItemSelect(rowData)}
                        />
                        </td>
                    <td>{rowData.machineName}</td>
                    <td>{rowData.userUsername} | {rowData.numEmployee}</td>
                    <td>
                      <span style={{ color: rowData.connected ? 'green' : 'gray', fontSize:'20px' }}>
                      {rowData.connected ? '↑' : '↓'}
                      </span>
                    </td>
                    <td>
                        <Button variant='outlined' color='secondary' onClick={() => history.push(`/machine-page/${rowData.idMachine}/${rowData.idOS}?idUser=${rowData.idUser}`)}>
                        <MovingIcon />
                        </Button>
                        <Button variant="outlined" onClick={() => history.push(`/editMachine/${rowData.idMachine}`)}  >
                          <EditIcon/>
                        </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="pagination-container">
            <PaginationComponent
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </div>
    </div>
  );
  
}

export default MachineAll;
