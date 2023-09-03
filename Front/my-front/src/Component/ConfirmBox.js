import React from 'react';

function ConfirmBox({ message, onConfirm, onCancel }) {
  return (
    <div className="confirm-box">
      <p>{message}</p>
      <button onClick={onConfirm}>Confirm</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
}

export default ConfirmBox;