import React, { Component } from 'react';
import '../../../Styles/CRUD.css'; 
import axios from 'axios';
import PaginationComponent from '../../Services/Pagination';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import { faSearch, faTrash, faEdit, faPlusCircle, faTimes } from '@fortawesome/free-solid-svg-icons';

class CRUD extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      searchQuery: '',
      currentPage: 1,
      itemsPerPage: 5,
      selectedItems: new Set(),
      selectAll: false,
    };
  }

  componentDidMount() {
    const apiUrl = process.env.REACT_APP_API_URL;
    axios
      .get(`${apiUrl}/${this.props.entity}`)
      .then((response) => {
        this.setState({ data: response.data });
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }

  //NAVIGATION
  handlePageChange = (newPage) => {
    this.setState({ currentPage: newPage });
  };

  //CLEAR
  handleClearSearch = () => {
    this.setState({ searchQuery: '' });
  };
  

  handleItemSelect = (rowData) => {
    const { selectedItems } = this.state;
    const newSelectedItems = new Set(selectedItems);

    if (newSelectedItems.has(rowData[this.props.idField])) {
      newSelectedItems.delete(rowData[this.props.idField]);
    } else {
      newSelectedItems.add(rowData[this.props.idField]);
    }

    this.setState({ selectedItems: newSelectedItems });
  };

  handleSelectAll = () => {
    const { selectedItems, data, selectAll, searchQuery } = this.state;

    if (selectAll) {
      this.setState({ selectedItems: new Set(), selectAll: false });
    } else {
      const filteredData = data.filter((rowData) =>
        Object.values(rowData).some((value) =>
          value.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
      );

      const allItemIds = filteredData.map((item) => item[this.props.idField]);
      this.setState({ selectedItems: new Set(allItemIds), selectAll: true });
    }
  };

  handleSearchInputChange = (e) => {
    this.setState({ searchQuery: e.target.value });
  };

  //DELETE
    handleDelete = (rowData) => {
      const { idField } = this.props;
      const apiUrl = process.env.REACT_APP_API_URL;

      axios
        .delete(`${apiUrl}/${this.props.entity}/${rowData[idField]}`)
        .then((response) => {
          const updatedData = this.state.data.filter((item) => item[idField] !== rowData[idField]);
          this.setState({ data: updatedData });

          console.log('Item deleted successfully:', response.data);
        })
        .catch((error) => {
          console.error('Error deleting item:', error);
        });
    };

    handleDeleteSelected = () => {
      const { idField } = this.props;
      const apiUrl = process.env.REACT_APP_API_URL;
      const { selectedItems } = this.state;
  
      const selectedIds = Array.from(selectedItems);
  
      Promise.all(
        selectedIds.map((itemId) =>
          axios.delete(`${apiUrl}/${this.props.entity}/${itemId}`)
        )
      )
        .then((responses) => {
          const updatedData = this.state.data.filter((item) => !selectedIds.includes(item[idField]));
          this.setState({ data: updatedData, selectedItems: new Set() });
  
          console.log('Selected items deleted successfully:', responses);
        })
        .catch((error) => {
          console.error('Error deleting selected items:', error);
        });
    };
  

  render() {
    const { data, currentPage, itemsPerPage, searchQuery, selectedItems, selectAll } = this.state;
    const { columns } = this.props;

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
        <div className="main" style={{ background: '#1a1a2e' }}>
          <div className="crud-container">
            {/* Search input */}
            <div className="search-container">
              <div className="search-input-container">
                <FontAwesomeIcon icon={faSearch} className={`search-icon ${this.state.searchQuery ? 'hidden' : ''}`} />
                <input
                  type="text"
                  placeholder="      Search..."
                  value={this.state.searchQuery}
                  onChange={this.handleSearchInputChange}
                  className="search-input"
                />
                {this.state.searchQuery && (
                  <button className="clear-button" onClick={this.handleClearSearch}>
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                )}
              </div>
            </div>
    
            <div className="table-wrapper" style={{ marginTop: '20px' }}>
              {/* Add button */}
              <div className="add-button-container">
                <FontAwesomeIcon icon={faTrash} className="delete-icon" onClick={() => this.handleDeleteSelected()} />
                <div className="add-button">
                  <Link to={`/add/${this.props.entity}`}>
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
                        onChange={this.handleSelectAll}
                        className="select-all-checkbox"
                      />
                    </th>
                    {columns.map((column) => (
                      <th key={column}>{column}</th>
                    ))}
                    <th></th>
                  </tr>
                </thead>
                <tbody>
        {dataToDisplay.map((rowData, index) => (
          <tr
            key={index}
            className={index % 2 === 0 ? 'crud-table-row-even' : null}
          >
            <td>
              <input
                type="checkbox"
                checked={selectedItems.has(rowData[this.props.idField])}
                onChange={() => this.handleItemSelect(rowData)}
              />
            </td>
            {columns.map((column) => (
              <td key={column}>{rowData[column]}</td>
            ))}
            <td>
              {selectedItems.has(rowData[this.props.idField]) ? (
                <> {/* If selected, render nothing (empty fragment) */}
                </>
              ) : (
                <> {/* If not selected, render the buttons */}
                  <Link to={`/edit/${this.props.entity}/${rowData[this.props.idField]}`} className="custom-link-button">
                    <button className="edit-button">
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                  </Link>
                  <button className="delete-button" onClick={() => this.handleDelete(rowData)}>
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
                onPageChange={this.handlePageChange}
              />
            </div>
            </div>
          </div>
        </div>
      </div>
    );
    
  }
}

export default CRUD;
