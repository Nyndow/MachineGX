import React, { useState, useEffect } from 'react';
import '../../../Styles/CRUD.css'; 
import axios from 'axios';
import PaginationComponent from '../../Services/Pagination';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import { faSearch, faEdit, faPlusCircle, faTimes } from '@fortawesome/free-solid-svg-icons';

function MachineAll() {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [connected , setConnected] = useState(false)
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    axios
      .get(`${apiUrl}/machineAll`)
      .then((response) => {
        setData(response.data.machineAll);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);
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
    <div className='main-container'>
      <div className="main">
        <div className="crud-container">
          <div className="search-container">
            <div className="search-input-container">
              <FontAwesomeIcon icon={faSearch} className={`search-icon ${searchQuery ? 'hidden' : ''}`} />
              <input
                type="text"
                placeholder="      Search..."
                value={searchQuery}
                onChange={handleSearchInputChange}
                className="search-input"
              />
              {searchQuery && (
                <button className="clear-button" onClick={handleClearSearch}>
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              )}
            </div>
          </div>
          <div className="table-wrapper" style={{ marginTop: '20px' }}>
            <table className="crud-table">
              <thead>
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
                    <tr key={index} className={index % 2 === 0 ? 'crud-table-row-even' : null}>
                        <td>
                        <input
                            type="checkbox"
                            checked={selectedItems.has(rowData.idUser)}
                            onChange={() => handleItemSelect(rowData)}
                        />
                        </td>
                    <td>{rowData.machineName}</td>
                    <td>{rowData.userUsername} | {rowData.numEmployee}</td>
                    <td></td>
                    <td>
                      <Link to={`/editMachine/${rowData.idMachine}`} className="custom-link-button">
                        <button className="edit-button">
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                      </Link>
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
  );
  
}

export default MachineAll;
