import React from 'react';
import { Pagination } from 'react-bootstrap';
import "../../Styles/Pagination.css"

const PaginationComponent = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className='pagination-container'>
    <Pagination>
      {Array.from({ length: totalPages }, (_, page) => (
        <Pagination.Item
          key={page}
          active={page + 1 === currentPage}
          onClick={() => onPageChange(page + 1)}
        >
          {page + 1}
        </Pagination.Item>
      ))}
    </Pagination>
    </div>
  );
};

export default PaginationComponent;
