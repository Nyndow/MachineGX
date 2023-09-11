import React, { Component } from 'react'
import CRUD from './CRUD'

export default class CRUDCommand extends Component {
  render() {
    return (
        <div><CRUD entity="command" idField="idCommand" columns={['idCommand', 'commandName','baseOS', 'commandDescription','commandComment']} /></div>
    )
  }
}
