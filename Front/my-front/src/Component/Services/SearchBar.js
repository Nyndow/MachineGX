import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';

const SearchBar = ({ data, updateFilteredData }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    const filteredData = data.filter((rowData) =>
      Object.values(rowData).some((value) =>
        value.toString().toLowerCase().includes(query.toLowerCase())
      )
    );

    updateFilteredData(filteredData);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    updateFilteredData(data);
  };

  return (
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
  );
};

export default SearchBar;
