import React, { Component } from 'react'
import CRUD from '../CRUD'

export default class CRUDCommand extends Component {
  render() {
    return (
        <div><CRUD entity="command" columns={['id-command', 'action', 'option']} /></div>
    )
  }
}
