import React, { useState, useEffect } from 'react';
import CardItem from './CardItem';
import axios from 'axios';
import '../../Styles/CardList.css'

const CardList = () => {
  const [cardData, setCardData] = useState([]);

  useEffect(() => {
    const apiUrl = process.env.REACT_APP_API_URL;
    axios
      .get(`${apiUrl}/machineList`)
      .then(response => {
        if (response.data && response.data.machineHome) {
          setCardData(response.data.machineHome);
        } else {
          console.error('Invalid API response format:', response.data);
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []); 

  return (
    <div className="card-list">
      {cardData.map((card, idMachine) => (
        <CardItem
          key={idMachine}
          title={card.machineName}
          description={card.ipAddr}
          imageUrl={card.imgOS}
        />
      ))}
    {/*<div className="pagination-container">
      <PaginationComponent
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={this.handlePageChange}
        />
      </div>*/}
      </div>
  );
}; 

export default CardList;
