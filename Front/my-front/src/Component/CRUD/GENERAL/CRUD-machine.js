import React, { Component } from 'react'
import CRUD from './CRUD'

export default class CRUDMachine extends Component {
  render() {
    return (
        <div><CRUD entity="machine" idField="idMachine" columns={['idMachine','os', 'machineName', 'ram', 'cpu', 'hdd','ipAddr']} /></div>
    )
  }
}
