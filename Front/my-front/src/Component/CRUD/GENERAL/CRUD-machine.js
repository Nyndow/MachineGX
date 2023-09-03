import React, { Component } from 'react'
import CRUD from './CRUD'

export default class CRUDMachine extends Component {
  render() {
    return (
        <div><CRUD entity="machine" columns={['id-machine', 'systeme', 'hardware']} /></div>
    )
  }
}
