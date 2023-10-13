import React from 'react';
import Pagination from '@mui/material/Pagination';

const PaginationComponent = ({ currentPage, totalPages, onPageChange }) => {
  const handleChange = (event, page) => {
    onPageChange(page);
  };

  return (
    <div className='pagination-container'>
      <Pagination
        count={totalPages}
        color="secondary"
        size="large"
        page={currentPage}
        onChange={handleChange}
      />
    </div>
  );
};

export default PaginationComponent;
