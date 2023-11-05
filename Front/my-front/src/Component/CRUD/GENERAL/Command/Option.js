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

export default function Option({ rowCommand }) {
  const [data, setData] = useState([]);
  const apiUrl = process.env.REACT_APP_API_URL;
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (rowCommand) {
      axios
        .get(`${apiUrl}/optionByCmd/${rowCommand.idCommand}`)
        .then((response) => {
          setData(response.data);
        })
        .catch((error) => {
          console.log(error);
          // Set data to an empty array when the request fails
          setData([]);
        });
    }
  }, [rowCommand]);

  const handleDeleteOption = (idOption) => {
    axios
      .delete(`${apiUrl}/option/${idOption}`)
      .then(() => {
        // Handle successful deletion
      })
      .catch(() => {
        // Handle error message
      });
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className='option-container'>
      <div>
        Command: {rowCommand.commandName}
        Note: {rowCommand.commandComment}
      </div>
      <hr></hr>
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
      {rowCommand ? (
        <div className="table-wrapper" style={{ marginTop: '20px' }}>
          <div></div>
          <table className="machine-table">
            <thead style={{ backgroundColor: '#110f18' }}>
              <tr>
                <th>Option</th>
                <th>Description</th>
                <th>Target</th>
                <th>Comment</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data
                .filter((item) =>
                  item.optionSyntax.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((rowData, index) => (
                  <tr
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
                      <Button variant="outlined" onClick={() => handleDeleteOption(rowData.idOption)}>
                        <DeleteIcon />
                      </Button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className='no-select'>
          <p style={{ marginLeft: '25%' }}>No data selected</p>
          <hr></hr>
          <p style={{ textAlign: 'center' }}>Click on the history you want to check</p>
        </div>
      )}
    </div>
  );
}
