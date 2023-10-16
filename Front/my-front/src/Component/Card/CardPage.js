import React, { useState } from 'react';
import axios from 'axios';
import Process from './Process';
import TerminalComponent from './Terminal';
import Command from './Command';
import Ressource from './Ressource';
import { useParams } from 'react-router-dom/cjs/react-router-dom';
import '../../Styles/CardPage.css';

export default function CardPage() {
  const { idMachine, idOS } = useParams();
  const apiUrl = process.env.REACT_APP_API_URL;
  const [buttonLabel, setButtonLabel] = useState('CONNECT');

  const handleConnect = () => {
    if (buttonLabel === 'CONNECT') {
      axios.post(`${apiUrl}/connect/${idMachine}`)
        .then(() => {
          setButtonLabel('DISCONNECT');
        })
        .catch((error) => {
          console.error(error);
        });
    } else if (buttonLabel === 'DISCONNECT') {
      axios.post(`${apiUrl}/disconnect/${idMachine}`)
        .then(() => {
          setButtonLabel('DISCONNECT');
        })
        .catch((error) => {
          console.error(error);
        });
      setButtonLabel('CONNECT');
    }
  }

  return (
    <div className='cardpage-container'>
      <div className='toAlign'>
        <div className='vertical'>
          <Process idMachine={idMachine} />
          <TerminalComponent idMachine={idMachine} />
        </div>
        <Command idMachine={idMachine} idOS={idOS} />
        <div className='right-side'>
          <button onClick={handleConnect} className='deconnect'>{buttonLabel}</button>
          <hr className='hr'></hr>
          <div className='ressource'>
            <Ressource />
          </div>
        </div>
      </div>
    </div>
  )
}
