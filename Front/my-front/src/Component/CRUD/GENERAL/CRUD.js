import React, { Component } from 'react';
import '../../../Styles/CRUD.css'; // Import the CSS file
import axios from 'axios';
import { Pagination } from 'react-bootstrap';
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
  

  //FETCH DATA
  componentDidMount() {
    const apiUrl = process.env.REACT_APP_API_URL;
    axios.get(`${apiUrl}/${this.props.entity}`)
      .then((response) => {
        this.setState({ data: response.data });
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }
  

  //DELETE
  handleDelete = (rowData) => {
    this.setState((prevState) => {
      const updatedData = prevState.data.filter((item) => item.id !== rowData.id);
      const updatedSelectedItems = new Set([...prevState.selectedItems].filter((id) => id !== rowData.id));
  
      return {
        data: updatedData,
        selectedItems: updatedSelectedItems,
      };
    });
  };
  
  handleDeleteSelected = () => {
    this.setState((prevState) => {
      const updatedData = prevState.data.filter((item) => !prevState.selectedItems.has(item.id));
      const updatedSelectedItems = new Set();
  
      return {
        data: updatedData,
        selectedItems: updatedSelectedItems,
      };
    });
  };
  

  //Change page
  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };

  // search function
  handleSearchInputChange = (e) => {
    this.setState({ searchQuery: e.target.value });
  };

  // SELECTION ITEM
  handleItemSelect = (rowData) => {
    const { selectedItems } = this.state;
    const newSelectedItems = new Set(selectedItems);

    if (newSelectedItems.has(rowData.id)) {
      newSelectedItems.delete(rowData.id);
    } else {
      newSelectedItems.add(rowData.id);
    }

    this.setState({ selectedItems: newSelectedItems });
  };


  handleSelectAll = () => {
    const { selectedItems, data, selectAll, searchQuery } = this.state;

    if (selectAll) {
      this.setState({ selectedItems: new Set(), selectAll: false });
    } else {
      // Filter the data based on the current search query
      const filteredData = data.filter((rowData) =>
        Object.values(rowData).some((value) =>
          value.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
      );

      const allItemIds = filteredData.map((item) => item.id);
      this.setState({ selectedItems: new Set(allItemIds), selectAll: true });
    }
  };


    //CLEAR SEARCH
    handleClearSearch = () => {
      this.setState({ searchQuery: "" });
    };
    

  render() {
    const { data, currentPage, itemsPerPage, searchQuery, selectedItems, selectAll } = this.state;
    const { columns } = this.props;

    // Filter data based on the search query
    const filteredData = data.filter((rowData) =>
      Object.values(rowData).some((value) =>
        value.toString().toLowerCase().includes(searchQuery.toLowerCase())
      )
    );

    // Calculate the start and end indices for pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const dataToDisplay = filteredData.slice(startIndex, endIndex);

    // Calculate the total number of pages
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    return (
      <div className="crud-container">
        {/* Search input field */}
        <div className="search-container">
          <div className="search-input-container">
            <FontAwesomeIcon icon={faSearch} className={`search-icon ${this.state.searchQuery ? 'hidden' : ''}`} />
            <input
              type="text"
              placeholder="     Search..."
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
                <th><input
            type="checkbox"
            checked={selectAll}
            onChange={this.handleSelectAll}
            className="select-all-checkbox"
          /></th>
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
                    checked={selectedItems.has(rowData.id)}
                    onChange={() => this.handleItemSelect(rowData)}
                  />
                </td>
                {columns.map((column) => (
                  <td key={column}>{rowData[column]}</td>
                ))}
                <td>
                  {selectedItems.has(rowData.id) ? ( // Check if the item is selected
                    <> {/* If selected, render nothing (empty fragment) */}
                    </>
                  ) : (
                    <> {/* If not selected, render the buttons */}
                      <Link to={`/edit/${this.props.entity}/${rowData.id}`} className="custom-link-button">
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
            <Pagination>
              {Array.from({ length: totalPages }, (_, page) => (
                <Pagination.Item
                  key={page}
                  active={page + 1 === currentPage}
                  onClick={() => this.handlePageChange(page + 1)}
                >
                  {page + 1}
                </Pagination.Item>
              ))}
            </Pagination>
          </div>
        </div>
      </div>
    );
  }
}

export default CRUD;
