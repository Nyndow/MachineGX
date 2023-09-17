import React, { useState, useEffect } from 'react';
import CardItem from './CardItem';
import axios from 'axios';
import '../../Styles/CardList.css';
import PaginationComponent from '../Services/Pagination'; // Import your PaginationComponent

const CardList = () => {
  const [cardData, setCardData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Current page state
  const itemsPerPage = 16; // Number of items to display per page

  useEffect(() => {
    const apiUrl = process.env.REACT_APP_API_URL;
    axios
      .get(`${apiUrl}/machineList`)
      .then((response) => {
        if (response.data && response.data.machineHome) {
          setCardData(response.data.machineHome);
        } else {
          console.error('Invalid API response format:', response.data);
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  // Function to slice the cardData based on current page and items per page
  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return cardData.slice(startIndex, endIndex);
  };

  // Function to handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="card-list">
      {getPaginatedData().map((card, idMachine) => (
        <CardItem
          key={idMachine}
          title={card.machineName}
          description={card.ipAddr}
          imageUrl={card.imgOS}
        />
      ))}
      <div className="pagination-container">
        <PaginationComponent
          currentPage={currentPage}
          totalPages={Math.ceil(cardData.length / itemsPerPage)}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default CardList;
