import React from 'react'
import Process from './Process'
import TerminalComponent from './Terminal'
import Command from './Command'
import Ressource from './Ressource'
import { useParams } from 'react-router-dom/cjs/react-router-dom'
import '../../Styles/CardPage.css'

export default function CardPage() {
  const { idMachine, idOS } = useParams();
  return (
    <div className='cardpage-container'>
      <div className='toAlign'>
        <div className='vertical'>
        <Process idMachine={idMachine}/>
        <TerminalComponent idMachine={idMachine}/>
        </div>
        <Command idMachine={idMachine} idOS={idOS}/>
        <div className='right-side'>
          <button className='deconnect'>DECONNECTION</button>
          <hr className='hr'></hr>
          <div className='ressource'>
            <Ressource/>
          </div>
        </div>
      </div>
    </div>
  )
}
