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
import { useHistory,useLocation } from 'react-router-dom';

export default function CardPage() {
  const { idMachine, idOS} = useParams();
  const [data, setData] = useState([]);
  const history = useHistory();
  const apiUrl = process.env.REACT_APP_API_URL;
  const [connected, setConnected] = useState(false)
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const user = queryParams.get('idUser');
  const [dataSelect, setDataSelect] = useState({
    idMachine: idMachine,
    idUser: '',
    idOS: idOS,
  });

  useEffect(() => {
    fetchUsers();
    if (user !== null) {
      verifyConn(user);
    }
  }, [user]);

  const fetchUsers = () => {
    axios
      .get(`${apiUrl}/machine_user/${idMachine}`)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          setConnected(true);
        }
      });
  }

  const verifyConn=(key) =>{
    axios.get(`${apiUrl}/verify_conn/${key}`)
    .then((response)=>{
      if(response.data.success === true){
        dataSelect.idUser = key;
        setConnected(true)
      }
    })
    .catch(()=>{
    })
  }

  const handleConnect = () => {
      togglePopup();
    }

  const handleConnection = (key) => {
    const requestData = {
      idMachine : idMachine,
    };
  axios.post(`${apiUrl}/connect/${key}`, requestData)
  .then(() => {
    setConnected(true);
    setDataSelect({
      ...dataSelect, 
      idUser: key, 
    });
    togglePopup()
  })
  .catch(() => {
    console.log('idUser:',key, 'idMachine:',Number(idMachine))
  });
}

/*DECONNECTION*/
const handleSuccessfulDisconnect = () => {
  setConnected(false)
};

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  return (
    <div className="cardpage-container">
      <div className="toAlign">
        <div className="vertical">
          <Process idMachine={idMachine} connected={connected}/>
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
          <DropdownButton onSuccessfulDisconnect={handleSuccessfulDisconnect} statusConnection={connected} idMachine={idMachine} selectedData={[dataSelect]} />
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
                    <ListItemButton  onClick={() => history.push(`/user_add/${idMachine}`)}>
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
