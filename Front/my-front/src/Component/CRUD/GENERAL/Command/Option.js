import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import '../../../../Styles/Option.css';
import ClearIcon from '@mui/icons-material/Clear';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddOption from './AddOption';
import EditOption from './EditOption';
import AddCircleIcon from '@mui/icons-material/AddCircle';

export default function Option({ rowCommand }) {
  const [data, setData] = useState([]);
  const apiUrl = process.env.REACT_APP_API_URL;
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);

  useEffect(() => {
    if (rowCommand) {
      fetchData(rowCommand.idCommand);
    }
  }, [rowCommand]);
  
  const fetchData = (commandId) => {
    axios
      .get(`${apiUrl}/optionByCmd/${commandId}`)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.log(error);
        setData([]);
      });
  };
  

  const chooseCommand = (idOption) => {
    const selectedRowData = data.find((item) => item.idOption === idOption);
    setSelectedRowData({optionSyntax:selectedRowData.optionSyntax,targetIn:selectedRowData.targetIn, idOption: selectedRowData.idOption,optionDescription: selectedRowData.optionDescription, optionComment: selectedRowData.optionComment });
  };

  const handleDeleteOption = (idOption) => {
    axios
      .delete(`${apiUrl}/option/${idOption}`)
      .then(() => {
      })
      .catch(() => {
      });
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const openAddDialog = () => {
    setAddDialogOpen(true);
  };

  const closeAddDialog = () => {
    setAddDialogOpen(false);
  };

  const openEditDialog = (commandId) => {
    setSelectedRowData(commandId);
    setEditDialogOpen(true);
  };

  const closeEditDialog = () => {
    setEditDialogOpen(false);
    fetchData;
  };


  return (
    <div className='option-container'>
      <div>
        Command: {rowCommand.commandName}
        Note: {rowCommand.commandComment}
      </div>
      {data.length > 0 ? (
        <div>
      <hr></hr>
      <TextField
        id="input-for-search-option"
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
        <div className="table-wrapper" style={{ marginTop: '20px',backgroundColor:'#110f18' }}>
        <div style={{display:'flex', justifyContent: 'flex-end' }}>
          <Button style={{marginBottom:'4%'}} size='large' variant="outlined" color="success" onClick={openAddDialog}>
            <AddCircleIcon/>
          </Button>
          </div>
          <table className="machine-table" style={{border:'none', borderRadius:'0%'}}>
            <thead>
              <tr>
                <th>Option</th>
                <th>Description</th>
                <th>Target</th>
                <th>Comment</th>
                <th></th>
              </tr>
            </thead>
            <tbody style={{backgroundColor: '#110f18'}}>
              {data
                .filter((item) =>
                  item.optionSyntax.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((rowData, index) => (
                  <tr
                  onClick={() => chooseCommand(rowData.idOption)}
                  style={{ backgroundColor: '#110f18' }}
                    key={index}
                    className={index % 2 === 0 ? 'crud-table-row-even' : 'crud-table-row-odd'}
                  >
                    <td>{rowData.optionSyntax}</td>
                    <td>{rowData.optionDescription}</td>
                    <td>
                      {rowData.targetIn ? (
                        <span style={{ color: 'green' }}>&#10004;</span>
                      ) : (
                        <span style={{ color: 'gray', fontSize: '0.7em' }}>&#10060;</span>
                      )}
                    </td>
                    <td>{rowData.optionComment}</td>
                    <td>
                      <Button variant="outlined" onClick={() => openEditDialog(rowData.idOption)}>
                        <EditIcon />
                      </Button>
                      <Button variant="outlined" color='secondary'  onClick={() => handleDeleteOption(rowData.idOption)}>
                        <DeleteIcon />
                      </Button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div></div>
      ) : (
        <div>
          <hr></hr>
          <p style={{ textAlign: 'center' }}>This command doesn't not have any option</p>
          <Button style={{ justifyContent: 'flex-end' }} size='large' variant="outlined" color="success" onClick={openAddDialog}>
            New
          </Button>
        </div>
      )}
      {isAddDialogOpen && (
        <AddOption
          idCommand={rowCommand.idCommand}
          closeAddDialog={closeAddDialog}
        />)}

{isEditDialogOpen && (
        <EditOption
          apiUrl={apiUrl}
          closeAddDialog={closeEditDialog}
          rowOption =  {selectedRowData}
        />
      )}
    </div>
  );
}
