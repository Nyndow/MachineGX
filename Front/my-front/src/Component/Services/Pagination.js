import React from 'react';
import Pagination from '@mui/material/Pagination';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  customPagination: {
    '& .MuiPaginationItem-root': {
      '&:hover': {
        backgroundColor: '#BF5CC8', 
      },
    },
    '& .MuiPaginationItem-page.Mui-selected': {
      backgroundColor: '#BF5CC8',
    },
  },
}));

const PaginationComponent = ({ currentPage, totalPages, onPageChange }) => {
  const classes = useStyles();

  const handleChange = (event, page) => {
    onPageChange(page);
  };

  return (
    <div className='pagination-container'>
      <Pagination
        count={totalPages}
        size="large"
        page={currentPage}
        onChange={handleChange}
        classes={{ root: classes.customPagination }}
      />
    </div>
  );
};

export default PaginationComponent;
