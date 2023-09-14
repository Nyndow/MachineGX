import React, { Component } from 'react'
import CRUD from './CRUD'

export default class CRUDOS extends Component {
  render() {
    return (
        <div><CRUD entity="oSys" idField="idOS" columns={['idOS','nomOS','versionOS', 'imgOS']} /></div>
    )
  }
}
