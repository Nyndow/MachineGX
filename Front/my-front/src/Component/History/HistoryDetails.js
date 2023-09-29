import React from 'react';
import '../../Styles/HistoryDetail.css';

export default function HistoryDetails(props) {
  const { idHistory } = props; // Destructure the idHistory prop

  return (
    <div className='history-item-container'>
      HistoryDetails for id: {idHistory}
      <hr></hr>
    </div>
  );
}
