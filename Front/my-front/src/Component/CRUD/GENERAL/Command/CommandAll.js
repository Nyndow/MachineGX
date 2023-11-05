import React, { useState, useEffect, useCallback } from 'react';
import '../../../../Styles/CommandAll.css';
import Option from './Option';
import ClearIcon from '@mui/icons-material/Clear';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import AddCommand from './AddCommand';
import EditCommand from './EditCommand';

export default function CommandAll() {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const apiUrl = process.env.REACT_APP_API_URL;
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const initialValue = {
    commandName: '',
    commandDescription: '',
    commandComment: '',
    idBaseOsys: '',
  };
  const [formData, setFormData] = useState(initialValue);
  const [baseOSList, setBaseOSList] = useState([]);
  const [selectedRowData, setSelectedRowData] = useState(null);


  useEffect(() => {
    fetchData();
    axios
      .get(`${apiUrl}/baseOsys`)
      .then((response) => {
        setBaseOSList(response.data);
      })
      .catch(() => {
        console.log('Error fetching base OS');
      });
  }, []);

  const fetchData = () => {
    axios
      .get(`${apiUrl}/command`)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }

  const openAddDialog = () => {
    setAddDialogOpen(true);
  };

  const openEditDialog = (commandId) => {
    setSelectedRowData(commandId);
    setEditDialogOpen(true);
  };

  const chooseCommand = (commandId) => {
    const selectedRowData = data.find((item) => item.idCommand === commandId);
    setSelectedRowData({commandName:selectedRowData.commandName, idCommand: selectedRowData.idCommand, commandComment: selectedRowData.commandComment });
  };

  const closeAddDialog = () => {
    setAddDialogOpen(false);
  };

  const closeEditDialog = () => {
    setEditDialogOpen(false);
    setSelectedRowData(null);
  };

  const handleDeleteCommand = (commandId) => {
    axios
      .delete(`${apiUrl}/command/${commandId}`)
      .then(() => {
        setData((prevData) => prevData.filter((item) => item.idCommand !== commandId));
      })
      .catch((error) => {
        console.error('Error deleting command:', error);
      });
  };

  const handleUserInputChange = useCallback((event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }, []);

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleNewCommandChange = useCallback(() => {

    const dataToSend = { ...formData };

    axios
      .post(`${apiUrl}/command/`, dataToSend)
      .then((response) => {
        setFormData(initialValue)
        closeAddDialog();
        fetchData();
      })
      .catch((error) => {
        console.error('Error sending data:', error);
      })
  },[apiUrl, , formData]);

  return (
    <div style={{ marginTop: '2%' }}>
      <div style={{ display: 'flex' }}>
        <div className="commands-container">
          <TextField
            id="input-with-icon-textfield"
            variant="outlined"
            type="text"
            style={{ backgroundColor: '#110f18', width: '100%' }}
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
          <Button style={{ justifyContent: 'flex-end' }} variant="outlined" color="success" onClick={openAddDialog}>
            New
          </Button>
          <div className="table-wrapper" style={{ marginTop: '20px' }}>
            <table className="machine-table">
              <thead style={{ backgroundColor: '#110f18' }}>
                <tr>
                  <th>Command</th>
                  <th>Description</th>
                  <th>Base OS</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {data
                  .filter((item) => item.commandName.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((rowData, index) => (
                    <tr onClick={() => chooseCommand(rowData.idCommand)} key={index} className={index % 2 === 0 ? 'crud-table-row-even' : 'crud-table-row-odd'}>
                      <td>{rowData.commandName}</td>
                      <td>{rowData.commandDescription}</td>
                      <td>
                        <img
                          style={{ width: '40px', height: '40px' }}
                          src={require(`../../../../Utils/distro-pics/${rowData.ImgOsys}`)}
                          alt={rowData.ImgOsys}
                        />
                      </td>
                      <td>
                        <Button variant="outlined" onClick={() => openEditDialog(rowData.idCommand)}>
                          <EditIcon />
                        </Button>
                        <Button variant="outlined" onClick={() => handleDeleteCommand(rowData.idCommand)}>
                          <DeleteIcon />
                        </Button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
        {selectedRowData &&(<Option 
      rowCommand = {selectedRowData}
      />)}
      </div>
      {isAddDialogOpen && (
        <AddCommand
          apiUrl={apiUrl}
          initialValue={initialValue}
          baseOSList={baseOSList}
          handleNewCommandChange={handleNewCommandChange}
          handleUserInputChange={handleUserInputChange}
          closeAddDialog={closeAddDialog}
          formData={formData}
        />
      )}
      {isEditDialogOpen && (
        <EditCommand
          apiUrl={apiUrl}
          baseOSList={baseOSList}
          closeAddDialog={closeEditDialog}
          idCommand =  {selectedRowData.idCommand}
          refreshData={fetchData}
        />
      )}
    </div>
  );
}
