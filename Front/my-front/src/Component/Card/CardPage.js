import React from 'react'
import Process from './Process'
import Terminal from './Terminal'
import Command from './Command'
import Ressource from './Ressource'

export default function CardPage() {
  return (
    <div className='cardpage-container'>
      <div className='toAlign'>
        <div className='vertical'>
        <Process/>
        <Terminal/>
        </div>
        <Command/>
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
