import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Process from './Process';
import TerminalComponent from './Terminal';
import Command from './Command';
import Ressource from './Ressource';
import DropdownButton from '../Services/DropButton';
import { useParams } from 'react-router-dom/cjs/react-router-dom';
import '../../Styles/CardPage.css';
import ClearIcon from '@mui/icons-material/Clear';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';
import { useHistory } from 'react-router-dom/cjs/react-router-dom';

export default function CardPage() {
  const { idMachine, idOS } = useParams();
  const [data, setData] = useState([]);
  const history = useHistory();
  const apiUrl = process.env.REACT_APP_API_URL;
  const [connected, setConnected] = useState(false)
  const [buttonLabel, setButtonLabel] = useState('CONNECT');
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleConnect = () => {
    if (buttonLabel === 'CONNECT') {
      togglePopup();
    } else if (buttonLabel === 'DISCONNECT') {
      axios
        .post(`${apiUrl}/disconnect/${idMachine}`)
        .then(() => {
          setConnected(true)
        })
        .catch((error) => {
          console.error(error);
        });
      setButtonLabel('CONNECT');
    }
  }

  const handleConnection = (key) => {
    const requestData = {
      idUser : key,
    };
  axios.post(`${apiUrl}/connect/${idMachine}`, requestData)
  .then(() => {
    setButtonLabel('DISCONNECT');
    togglePopup()
  })
  .catch(() => {
    console.log('idUser:',key, 'idMachine:',Number(idMachine))
  });
}

  const fetchUsers = () => {
    axios
      .get(`${apiUrl}/machine_user/${idMachine}`)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  return (
    <div className="cardpage-container">
      <div className="toAlign">
        <div className="vertical">
          <Process idMachine={idMachine} />
          <TerminalComponent idMachine={idMachine} />
        </div>
        <Command idMachine={idMachine} idOS={idOS} />
        <div className="right-side">
        <div style={{ display: 'flex', justifyContent:'space-around', marginTop:'20px'}}>
          {!connected && (
            <button onClick={handleConnect} className='deconnect'>
              Connect
            </button>
          )}
          <DropdownButton statusConnection={connected} idMachine={idMachine} />
        </div>
          <hr className="hr"></hr>
          <div className="ressource">
            <Ressource />
          </div>
        </div>
      </div>

      {/* Popup connection */}
      <div className="popup-container">
        {isPopupOpen && (
          <div className="popup">
            <div className="popup-content">
              <ClearIcon onClick={() => togglePopup()} className="close-icon" />

              {/* List inside the popup */}
              <List>
                {data.map((item) => (
                  <ListItem onClick={() => handleConnection(item.idUser)} disablePadding key={item.idUser} style={{ padding: '20px', height: '60px' }}>
                    <ListItemButton>
                      <ListItemIcon>
                        <PersonIcon />
                      </ListItemIcon>
                      <ListItemText primary={item.userUsername} />
                    </ListItemButton>
                  </ListItem>
                ))}
                    <ListItemButton  onClick={() => history.push('/user_add')}>
                      <ListItemIcon>
                        <AddIcon />
                      </ListItemIcon>
                      <ListItemText primary={"Add a new user"} />
                    </ListItemButton>
              </List>
              {/* End of List inside the popup */}
            </div>
          </div>
        )}
      </div>
      {/* Ending upload Section */}
    </div>
  );
}
