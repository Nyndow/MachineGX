import React, { Component } from 'react'
import CRUD from '../CRUD'

export default class CRUDHistory extends Component {
  render() {
    return (
        <div><CRUD entity="history" columns={['id-history', 'idMachine','idAdmin', 'date']} /></div>
    )
  }
}
