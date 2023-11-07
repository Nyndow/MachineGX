import React, { useState, useEffect } from 'react';
import '../../../Styles/CRUD.css'; 
import axios from 'axios';
import PaginationComponent from '../../Services/Pagination';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import { faSearch, faTrash, faEdit, faPlusCircle, faTimes } from '@fortawesome/free-solid-svg-icons';

function CRUD(props) {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    axios
      .get(`${apiUrl}/attribution`)
      .then((response) => {
        setData(response.data);
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

  const handleItemSelect = (idAttribution) => {
    const newSelectedItems = new Set(selectedItems);
    if (newSelectedItems.has(idAttribution)) {
      newSelectedItems.delete(idAttribution);
    } else {
      newSelectedItems.add(idAttribution);
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
      const allItemIds = filteredData.map((item) => item.idAttribution);
      setSelectedItems(new Set(allItemIds));
      setSelectAll(true);
    }
  };

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleDelete = (idAttribution) => {
    axios
      .delete(`${apiUrl}/attribution/${idAttribution}`)
      .then((response) => {
        const updatedData = data.filter((item) => item.idAttribution !== idAttribution);
        setData(updatedData);
        console.log('Item deleted successfully:', response.data);
      })
      .catch((error) => {
        console.error('Error deleting item:', error);
      });
  };

  const handleDeleteSelected = () => {
    const selectedIds = Array.from(selectedItems);
    Promise.all(
      selectedIds.map((itemId) =>
        axios.delete(`${apiUrl}/attribution/${itemId}`)
      )
    )
      .then((responses) => {
        const updatedData = data.filter((item) => !selectedIds.includes(item.idAttribution));
        setData(updatedData);
        setSelectedItems(new Set());
        console.log('Selected items deleted successfully:', responses);
      })
      .catch((error) => {
        console.error('Error deleting selected items:', error);
      });
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
            <div className="add-button-container">
              <FontAwesomeIcon icon={faTrash} className="delete-icon" onClick={handleDeleteSelected} />
              <div className="add-button">
                <Link to={'/attribution_add'}>
                  <button className="add-button-icon">
                    <FontAwesomeIcon icon={faPlusCircle} />
                  </button>
                </Link>
              </div>
            </div>
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
                  <th>Employee</th>
                  <th>Start date</th>
                  <th>End date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
              {dataToDisplay.map((rowData, index) => (
              <tr key={index}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedItems.has(rowData.idAttribution)}
                    onChange={() => handleItemSelect(rowData.idAttribution)}
                  />
                </td>
                <td>{rowData.machineName}</td>
                <td>{rowData.userUsername}</td>
                <td>{rowData.numEmployee}</td>
                <td>{rowData.dateDebut}</td>
                <td>{rowData.dateFin}</td>
                    <td>
                      {selectedItems.has(rowData.idAttribution) ? (
                        <>
                        </>
                      ) : (
                        <>
                          <Link to={`/edit/attribution/${rowData.idAttribution}`} className="custom-link-button">
                            <button className="edit-button">
                              <FontAwesomeIcon icon={faEdit} />
                            </button>
                          </Link>
                          <button className="delete-button" onClick={() => handleDelete(rowData.idAttribution)}>
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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

export default CRUD;
