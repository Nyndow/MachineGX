import React, { useState, useEffect } from 'react';
import '../../../../Styles/MachineAll.css'; 
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import PaginationComponent from '../../../Services/Pagination';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import EditIcon from '@mui/icons-material/Edit';
import Button from '@mui/material/Button';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ClearIcon from '@mui/icons-material/Clear';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';


function BaseOS() {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const apiUrl = process.env.REACT_APP_API_URL;
  const history = useHistory();

  useEffect(() => {
    fetchData()
  }, []);

  const fetchData = () =>{
    axios
    .get(`${apiUrl}/baseOsys`)
    .then((response) => {
      setData(response.data)
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
  }

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };


  const handleDelete = (idOS) => {
    axios
      .delete(`${apiUrl}/baseOsys/${idOS}`)
      .then((response) => {
        const updatedData = data.filter((item) => item.idBaseOsys !== idOS);
        setData(updatedData);
        console.log('Item deleted successfully:', response.data);
      })
      .catch((error) => {
        console.error('Error deleting item:', error);
      });
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
    <div className='machineMain-container' style={{ margin: '20px auto', width: '65%' }}>
      <div className="machine">
        <div className="machine-container">
          <div>
          </div>
          <div style={{ marginTop: '20px' }}>
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
                </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Link to={`/base_osys_add`} style={{ marginRight: '10px' }}>
                <Button size='large' color='success' variant="outlined">
                    <AddCircleIcon/>
                </Button>
              </Link>

            </div>
          </div>
          <div className="table-wrapper">
            <table className="machine-table">
              <thead style={{backgroundColor:'#110f18'}}>
                <tr>
                  <th></th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {dataToDisplay.map((rowData, index) => (
                    <tr key={index} className='crud-table-row-even'>
                    <td>{rowData.nameBase}</td>
                    <td>
                    <img src={require(`../../../../Utils/distro-pics/${rowData.imgBase}`)}/>
                    </td>
                    <td>
                        <Button variant="outlined" onClick={() => history.push(`/base_osys_edit/${rowData.idBaseOsys}`)}  >
                          <EditIcon/>
                        </Button>
                        <Button onClick={() => handleDelete(rowData.idBaseOsys)} variant="outlined" color='secondary'>
                          <DeleteIcon/>
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

export default BaseOS;
