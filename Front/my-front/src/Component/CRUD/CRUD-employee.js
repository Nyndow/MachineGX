import React, { Component } from 'react'
import CRUD from '../CRUD'

export default class CRUDEmployee extends Component {
  render() {
    return (
        <div><CRUD entity="employee" columns={['id-employee', 'nom', 'contact']} /></div>
    )
  }
}
