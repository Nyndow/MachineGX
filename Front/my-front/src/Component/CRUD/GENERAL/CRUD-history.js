import React, { Component } from 'react'
import CRUD from './CRUD'

export default class CRUDHistory extends Component {
  render() {
    return (
        <div><CRUD entity="history" idField="idHistory" columns={['idHistory', 'idMachine','idAdmin', 'date']} /></div>
    )
  }
}
